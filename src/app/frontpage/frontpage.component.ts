import { Component, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { ArticlesService } from '../services/articles/articles.service';
import { ArticleDetailDialogComponent, Feedback } from '../article-detail-dialog/article-detail-dialog.component';
import { FeedbackService } from '../services/feedback/feedback.service';
import { QuizzesService } from '../services/quizzes/quizzes.service';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

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

interface Quiz {
  id: number;
  question: string;
  options: string[];
}

@Component({
  selector: 'app-article-feed',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatCardModule, MatButtonModule, MatListModule, MatSidenavModule,
    MatDividerModule, MatBadgeModule, MatSnackBarModule],
  providers: [MatSnackBar],
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent {
  //UserId GUID
  userId = environment.userId;
  sessionId = "";
  articles: Article[] = [];

  quizzes: Quiz[] = [];

  feedback: Feedback = {  
    quiz: {
      quiz_question: '',
      quiz_options: '',
      selected_value: ''
    }
  }

  constructor(private dialog: MatDialog, private articlesService: ArticlesService, private feedbackService: FeedbackService, private quizzesService: QuizzesService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchArticles();
    this.fetchQuizzes();
    this.sessionId = this.generateSessionId();
  }

  fetchArticles(): void {
    this.articlesService.getArticles(this.userId).subscribe({
      next: (response) => {
        let articles = response.articles || response;
        // Sort the articles by datetime_generated in descending order (newest first)
        this.articles = articles.sort((a: Article, b: Article) =>
        new Date(b.datetime_generated).getTime() - new Date(a.datetime_generated).getTime()
      );
      },
      error: (err: string) => {
        console.error('Error fetching articles:', err);
      }
    });
  }

  fetchQuizzes(): void {
    this.quizzesService.getQuizzes(this.userId).subscribe({
      next: (quizzes: Quiz[]) => {
        this.quizzes = this.shuffleArray(quizzes);
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

    article.isUnread = false;
    
    this.articlesService.markArticleAsRead(article.document_id).subscribe({
      next: () => console.log("Article marked as read on server"),
      error: (err) => console.error("Error updating article read status:", err)
    });

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

  submitQuizAnswer(quiz: { quiz_question: string, quiz_options: string, selected_value: string }, user_id: string, session_id: string): void {
    this.feedback.quiz = quiz;
    this.feedbackService.sendFeedback(this.feedback, this.userId, this.sessionId)
      .subscribe({
        next: (response: any) => {
          console.log("Quiz feedback submitted:", response);
          this.snackBar.open('Quiz response has been submitted!', 'Dismiss', {
            duration: 5000,  // The notification will be visible for 3 seconds
            verticalPosition: 'top'
          });
        },
        error: (error: any) => {
          console.error("Error submitting quiz feedback:", error);
          this.snackBar.open('Error submitting quiz answer. Please try again.', 'Dismiss', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }
      });
  }

  shuffleArray(array: Quiz[]): Quiz[] {
    // Create a copy of the array to avoid modifying the original directly
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  openChatbotModal() {
    const dialogRef = this.dialog.open(ChatbotComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        prompt: "Can't find any articles to your taste? Chat to us and let us know what you'd like us to write about",
      }
    });

    dialogRef.afterClosed().subscribe((article: Article | undefined) => {
      if (article) {

        article.isUnread = false;
    
        this.articlesService.markArticleAsRead(article.document_id).subscribe({
          next: () => console.log("Article marked as read on server"),
          error: (err) => console.error("Error updating article read status:", err)
        });
        // Open the Article Detail Dialog with the returned article.
        const articleRef = this.dialog.open(ArticleDetailDialogComponent, {
          width: '80vw',
          panelClass: 'custom-dialog-container',
          data: { article: article, userId: this.userId, sessionId: this.sessionId }
        });
        // Once the article detail modal is closed, refresh the articles.
        articleRef.afterClosed().subscribe(() => {
          this.fetchArticles();
        });
      } else {
        // If no article was created (or the user canceled), still refresh articles.
        this.fetchArticles();
      }
    });
  }
  
}