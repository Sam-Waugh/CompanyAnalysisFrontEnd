import { Component, NgModule, ViewEncapsulation  } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChatbotService } from '../services/chatbot/chatbot.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotPerplexityService } from '../services/chatbot/chatbot-perplexity.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { jsPDF } from 'jspdf';

export interface Report {
  llm_response: {
    title: string;
    excerpt: string;
    full_article: string;
  };
}


@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.css'],
    standalone: true, 
    imports: [FormsModule, CommonModule, MatCardModule, MatSlideToggleModule],
    encapsulation: ViewEncapsulation.None,
    template: `
      <app-header></app-header>
      <app-content></app-content>
    `,
    styles: ``,
})
  
export class ChatbotComponent {
  userResponse: string = '';
  currentQuestion: string = '';
  sessionId: string = '';
  chatHistory: { question: string, answer: string }[] = [];
  isCompleted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  isFeedbackStage: boolean = false;
  feedback: string = '';
  selectedFormat: string = 'txt'; // Default to .txt format
  finalResponse: Report | null = null;

  constructor(private chatbotService: ChatbotService) {
    this.startChat();
  }

  startChat(): void {
    this.sessionId = this.generateSessionId();
    this.isLoading = true; // Indicate loading while chatbot fetches the first question

    this.chatbotService.getNextQuestion(this.sessionId).subscribe({
      next: (res) => {
        this.currentQuestion = res.question; // Set the first question
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error getting initial question:', err);
        this.errorMessage = 'Failed to load chatbot question.';
        this.isLoading = false;
      }
    });
  }

  /**
  * Handles user responses and submits them to the backend.
  * @param response - User's response to the current question.
  */
  submitResponse(response: string): void {
    if (!response.trim()) return;
    this.isLoading = true;
    this.chatHistory.push({ question: this.currentQuestion, answer: response });
    this.chatbotService.submitChatbotResponse(this.sessionId, response).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'in_progress') {
          this.currentQuestion = res.question;
          this.userResponse = '';
        } else if (res.status === 'complete') {
          this.isCompleted = true;
          this.finalResponse = {
            llm_response: res.llm_response || { title: '', excerpt: '', full_article: '' },
          };
          this.isFeedbackStage = true;
          this.currentQuestion = "Did this report meet your expectations? Provide feedback:";
        }
      },
      error: (err) => {
        console.error('Error in chatbot flow:', err);
        alert('Something went wrong. Please try again.')
        this.isLoading = false;
      }
    });
  }

  /**
   * Handles user feedback submission after article generation.
   */
  submitFeedback(): void {
    if (!this.feedback.trim()) return;

    this.isLoading = true;
    this.chatbotService.submitUserFeedback(this.sessionId, this.feedback).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Thank you for your feedback!');
        this.isFeedbackStage = false;
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        alert('Something went wrong. Please try again.');
        this.isLoading = false;
      }
    });
  }

  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 11); // Simple session ID generation
  }

  onSubmit(): void {
    if (this.userResponse.trim()) {
      const response = this.userResponse.trim();
      this.userResponse = ''; // Clear the input field
      this.submitResponse(response);
    }
  }
  
  downloadReport(): void {
    const articleTitle = this.finalResponse?.llm_response?.title || 'No content available';
    const articleExcerpt = this.finalResponse?.llm_response?.excerpt || 'No content available';
    const articleContent = this.finalResponse?.llm_response?.full_article || 'No content available';
    const combinedText = `${articleTitle}\n\n${articleExcerpt}\n\n${articleContent}`;

    const blob: Blob = this.selectedFormat === 'txt'
      ? new Blob([combinedText], { type: 'text/plain' })
      : this.createPdfBlob(articleTitle, articleExcerpt, articleContent);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = this.selectedFormat === 'txt' ? 'generated_report.txt' : 'generated_report.pdf';
    link.click();
  }

  // Helper function to create a PDF Blob from content
  createPdfBlob(title: string, excerpt: string, content: string): Blob {
    const pdfDoc = new jsPDF();
    pdfDoc.setFontSize(18);
    pdfDoc.text(title, 10, 20);

    // Add the excerpt with a medium font size
    pdfDoc.setFontSize(14);
    pdfDoc.text(excerpt, 10, 40);

    // Add the full article content with a normal font size.
    // splitTextToSize handles long text wrapping automatically.
    pdfDoc.setFontSize(12);
    const splitContent = pdfDoc.splitTextToSize(content, 180); // Adjust the width as needed
    pdfDoc.text(splitContent, 10, 60);
    //pdfDoc.text(content, 10, 10); // Starting point (x, y) in PDF
    return pdfDoc.output('blob');
  }

  // onSubmit() {
  //   this.isLoading = true;
  //   this.errorMessage = '';
  //   if (!this.userInput.trim() || !this.industry.trim() || !this.businessGoal.trim()) {
  //     alert('Please fill in all fields.');
  //     return;
  //   }

  //   this.chatbotService.submitQuestion(this.userInput, this.industry, this.businessGoal).subscribe({
  //     next: (res) => {
  //       this.chatResponse = res.response; // Update based on API's response format
  //       this.followUpQuestions = res.follow_up_questions;
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       this.errorMessage = error.message;
  //       this.chatResponse = 'An error occurred. Please try again later.';
  //       this.followUpQuestions = [];
  //       this.isLoading = false;
  //     },
  //   });
  // }
}
