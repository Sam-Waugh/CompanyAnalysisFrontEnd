import { Component, NgModule, ViewEncapsulation  } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { QuestionService } from '../services/question/question.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuestionPerplexityService } from '../services/question/question-perplexity.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@Component({
    selector: 'app-question-form',
    templateUrl: './question-form.component.html',
    styleUrls: ['./question-form.component.css'],
    standalone: true, 
    imports: [JsonPipe, FormsModule, CommonModule, MatCardModule, MatSlideToggleModule],
    encapsulation: ViewEncapsulation.None,
    template: `
      <app-header></app-header>
      <app-content></app-content>
    `,
    styles: ``,
})
  
export class QuestionFormComponent {
  // Built using Angular Material documentation: https://material.angular.dev/components/categories
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
