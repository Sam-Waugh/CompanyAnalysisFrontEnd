import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuestionFormComponent } from './question-form/question-form.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QuestionFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'aifrontend';
}