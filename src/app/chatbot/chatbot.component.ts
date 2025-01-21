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
    standalone: true, 
    imports: [JsonPipe, FormsModule, CommonModule, MatCardModule, MatSlideToggleModule],
    encapsulation: ViewEncapsulation.None
})
  
export class ChatbotComponent {
  userInput: string = '';
  chatResponse: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private chatbotService: ChatbotService) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.chatbotService.submitQuestion(this.userInput).subscribe({
      next: (response) => {
        this.chatResponse = response.message; // Update based on API's response format
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }
}
