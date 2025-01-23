import { Component, NgModule, ViewEncapsulation  } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChatbotService } from '../services/chatbot/chatbot.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotPerplexityService } from '../services/chatbot/chatbot-perplexity.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


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
  finalResponse: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private chatbotService: ChatbotService) {
    this.startChat();
  }

  startChat(): void {
    this.sessionId = this.generateSessionId();
    this.submitResponse(null);
  }

  /**
  * Handles user responses and submits them to the backend.
  * @param response - User's response to the current question.
  */
  submitResponse(response: string | null): void {
    this.isLoading = true;
    this.chatbotService.submitChatbotResponse(this.sessionId, response).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'in_progress') {
          if (response) {
            this.chatHistory.push({ question: this.currentQuestion, answer: response });
          }
          this.currentQuestion = res.question;
        } else if (res.status === 'complete') {
          this.isCompleted = true;
          this.finalResponse = res.result;
        }
      },
      error: (err) => {
        console.error('Error in chatbot flow:', err);
        alert('Something went wrong. Please try again.')
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
