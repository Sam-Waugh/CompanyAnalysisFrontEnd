import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { ArticlesService } from '../services/articles/articles.service';
import { ArticleDetailDialogComponent, Feedback } from '../article-detail-dialog/article-detail-dialog.component';
import { FeedbackService } from '../services/feedback/feedback.service';
import { QuizzesService } from '../services/quizzes/quizzes.service';

interface Article {
  document_id: string;
  user_id: string;
  datetime_generated: string;
  title: string;
  excerpt: string;
  full_article: string;
  article_image: string;
  personal_explanation: string;
  keywords: string;
  prompt_programme_id: string;
  author_name: string;
  author_photo_path: string;
}

interface Quiz {
  id: number;
  question: string;
  options: string[];
}

@Component({
  selector: 'app-article-feed',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatCardModule, MatButtonModule, MatListModule, MatSidenavModule,
    MatDividerModule ],
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent {
  //@ViewChild('quizTemplate') quizTemplate!: TemplateRef<any>;
  //UserId GUID
  userId = "41a90bc4-408c-4ae4-9bc0-27a6357ab8eb"
  sessionId = "";
  articles: Article[] = [
    // {
    //   title: 'AI and the Future of Business',
    //   excerpt: 'How artificial intelligence is shaping industries...',
    //   content: 'Full article content here...'
    // },
    // {
    //   title: 'The Rise of Quantum Computing',
    //   excerpt: 'Exploring the latest breakthroughs in quantum technology...',
    //   content: 'Full article content here...'
    // }
  ];

  quizzes: Quiz[] = [
    // {
    //   id: 1,
    //   question: 'What superhero would you be?',
    //   options: ['Iron Man', 'Spider-Man', 'Wonder Woman', 'Thor']
    // },
    // {
    //   id: 2,
    //   question: 'What type of movies do you prefer?',
    //   options: ['Action', 'Comedy', 'Drama', 'Sci-Fi']
    // },
    // {
    //   id: 3,
    //   question: 'Choose your ideal vacation destination:',
    //   options: ['Beach', 'Mountains', 'City Tour', 'Adventure']
    // },
    // {
    //   id: 4,
    //   question: 'Which Business Trend Matches Your Personality?',
    //   options: ['Tech Innovator', 'Strategic Thinker', 'Risk-Taker']
    // }
  ];

  feedback: Feedback = {  
    quiz: {
      quiz_question: '',
      quiz_options: '',
      selected_value: ''
    }
  }

  constructor(private dialog: MatDialog, private articlesService: ArticlesService, private feedbackService: FeedbackService, private quizzesService: QuizzesService) {}

  ngOnInit(): void {
    this.fetchArticles();
    this.fetchQuizzes();
    this.sessionId = this.generateSessionId();
  }
  
  // ngAfterViewInit() {
  //   // You can add checks here to see if the template is properly initialized
  //   if (!this.quizTemplate) {
  //     console.error('Quiz template is not defined.');
  //   }
  // }

  fetchArticles(): void {
    this.articlesService.getArticles(this.userId).subscribe({
      next: (response) => {
        // Adjust based on the structure of your backend response.
        // For example, if the response is an object with an "articles" array:
        this.articles = response.articles || response;
      },
      error: (err: string) => {
        console.error('Error fetching articles:', err);
      }
    });
  }

  fetchQuizzes(): void {
    this.quizzesService.getQuizzes(this.userId).subscribe({
      next: (quizzes: Quiz[]) => {
        this.quizzes = quizzes;
        console.log('Fetched quizzes:', this.quizzes);
      },
      error: (err: string) => {
        console.error('Error fetching quizzes:', err);
      }
    });
  }

  viewArticle(article: Article, userId: string, sessionId: string) {
    if (!article) {
      console.error('Article is undefined or null!');
      return;
    }
    console.log(`User clicked on article: ${article.title}`);
    
    // Open the article in a dialog popup
    this.dialog.open(ArticleDetailDialogComponent, {
      width: '65vw',
      panelClass: 'custom-dialog-container',
      data: { article: article, userId: userId, sessionId: sessionId }
    });
    // Future: Open article in a dialog and log user interaction

    // // After clicking on an article, trigger a quiz to gather feedback
    // this.openQuiz();
  }

  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 11); // Simple session ID generation
  }

  logFeedback(category: string) {
    console.log(`User prefers articles about: ${category}`);
    // Future: Send user preference data to backend for personalised recommendations
  }

  // openQuiz() {
  //   const dialogRef = this.dialog.open(this.quizTemplate);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`User chose superhero: ${result}`);
  //     // You can send the quiz result to your backend for further analysis
  //   });
  // }

  submitQuizAnswer(quiz: { quiz_question: string, quiz_options: string, selected_value: string }, user_id: string, session_id: string): void {
    this.feedback.quiz = quiz;
    this.feedbackService.sendFeedback(this.feedback, this.userId, this.sessionId)
      .subscribe({
        next: (response: any) => {
          console.log("Quiz feedback submitted:", response);
        },
        error: (error: any) => {
          console.error("Error submitting quiz feedback:", error);
        }
      });
      
  //     quiz: { quiz_question: string, quiz_options: string, selectedValue: string }, user_id: string, session_id: string) {
  //   console.log(`User answered quiz ${quiz.quiz_question} with: ${quiz.selectedValue}`);
  //   let feedback = { quiz };
  //   this.feedbackService.sendFeedback(feedback, user_id, session_id);
  // }
  }
}