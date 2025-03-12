import { Component, Optional, ViewEncapsulation, Inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ChatbotService } from '../services/chatbot/chatbot.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotPerplexityService } from '../services/chatbot/chatbot-perplexity.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { jsPDF } from 'jspdf';
import { ArticleDetailDialogComponent } from '../article-detail-dialog/article-detail-dialog.component';


interface Article {
  document_id: string;
  user_id: string;
  datetime_generated: string;
  isUnread: boolean;
  title: string;
  excerpt: string;
  full_article: string;
  article_image: string;
  personal_explanation: string;
  keywords: string;
  prompt_programme_id: string;
  author_name: string;
  author_photo_path: string;
  author_description: string;
}

interface Author {
  id: string;
  author_name: string;
  author_description: string;
  author_photo_path: string;
}

@Component({
    selector: 'app-chatbot',
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.css'],
    standalone: true, 
    imports: [FormsModule, CommonModule, MatCardModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule],
    encapsulation: ViewEncapsulation.None,
    styles: ``,
})
  
export class ChatbotComponent {
  userResponse: string = '';
  currentQuestion: string = '';
  userId: string = "41a90bc4-408c-4ae4-9bc0-27a6357ab8eb";
  sessionId: string = '';
  chatHistory: { question: string, answer: string }[] = [];
  isCompleted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  isFeedbackStage: boolean = false;
  feedback: string = '';
  selectedFormat: string = 'txt'; // Default to .txt format
  finalResponse: any;
  prompt: string;
  selectedAuthorId: string = '';
  authors: Author[] = [];

  constructor(@Optional() public dialogRef: MatDialogRef<ChatbotComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private chatbotService: ChatbotService, private dialog: MatDialog
    ) {
    this.prompt = data?.prompt || 'ChatBot';
    this.startChat();
    this.getAuthors();
  }

  startChat(): void {
    this.sessionId = this.generateSessionId();
    this.isLoading = true; // Indicate loading while chatbot fetches the first question

    this.chatbotService.getNextQuestion(this.sessionId, this.userId).subscribe({
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

  getAuthors(): void {
    this.chatbotService.getAuthors().subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        // Adjust based on response structure:
        if (Array.isArray(response)) {
          this.authors = response;
        } else if (response.authors && Array.isArray(response.authors)) {
          this.authors = response.authors;
        } else {
          // Fallback: try converting the object into an array
          this.authors = Object.values(response);
        }
        console.log('Fetched authors:', this.authors);
      },
      error: (err: string) => {
        console.error('Error fetching authors:', err);
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

    this.chatbotService.submitChatbotResponse(this.sessionId, this.userId, this.selectedAuthorId, response).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'in_progress') {
          this.currentQuestion = res.question;
          this.userResponse = '';
        } else if (res.status === 'complete') {
          this.isCompleted = true;
          if (this.isCompleted && res.result && res.result.full_article) {
            this.finishArticleCreation(res.result);
          }
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
    this.chatbotService.submitUserFeedback(this.sessionId, this.userId, this.feedback).subscribe({
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

  finishArticleCreation(article: Article): void {
    // Close the chatbot modal
    this.dialogRef.close(article);
  }
}
