import { Component, NgModule } from '@angular/core';
import { QuestionService } from '../question.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  standalone: true,
  imports: [JsonPipe, FormsModule, CommonModule],
})
  
export class QuestionFormComponent {
  question: string = '';
  response: any;

  constructor(private questionService: QuestionService) {}

  onSubmit() {
    this.questionService.submitQuestion(this.question).subscribe(
      res => {
        this.response = res;
        this.question = ''; // Clear the input after submission
      },
      err => {
        console.error('Error submitting question:', err);
      }
    );
  }
}
