import { Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { QuestionService } from '../services/question.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionPerplexityService } from '../services/question-perplexity.service';


@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  standalone: true,
  imports: [JsonPipe, FormsModule, CommonModule, MatCardModule],
})
  
export class QuestionFormComponent {
  question: string = '';
  response: any;
  responsePerplexity: any;

  constructor(private questionService: QuestionService, 
    private questionPerplexityService: QuestionPerplexityService,
  ) {}

  onSubmit() {
    this.questionService.submitQuestion(this.question).subscribe(
      res => {
        this.response = res;
      },
      err => {
        console.error('Error submitting question:', err);
      }
    );
    this.questionPerplexityService.submitQuestion(this.question).subscribe(
      res => {
        this.responsePerplexity = res;
        this.question = ''; // Clear the input after submission
      },
      err => {
        console.error('Error submitting question:', err);
      }
    );
  }
}
