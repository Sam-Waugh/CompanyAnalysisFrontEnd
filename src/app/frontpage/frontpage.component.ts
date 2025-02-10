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
import { ArticleDetailDialogComponent } from '../article-detail-dialog/article-detail-dialog.component';

interface Article {
  datetime_generated: string,
  user_id: string;
  title: string;
  excerpt: string;
  content: string;
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
    {
      id: 1,
      question: 'What superhero would you be?',
      options: ['Iron Man', 'Spider-Man', 'Wonder Woman', 'Thor']
    },
    {
      id: 2,
      question: 'What type of movies do you prefer?',
      options: ['Action', 'Comedy', 'Drama', 'Sci-Fi']
    },
    {
      id: 3,
      question: 'Choose your ideal vacation destination:',
      options: ['Beach', 'Mountains', 'City Tour', 'Adventure']
    }
  ];

  constructor(private dialog: MatDialog, private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.fetchArticles();
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

  viewArticle(article: Article) {
    if (!article) {
      console.error('Article is undefined or null!');
      return;
    }
    console.log(`User clicked on article: ${article.title}`);
    
    // Open the article in a dialog popup
    this.dialog.open(ArticleDetailDialogComponent, {
      width: '65vw',
      panelClass: 'custom-dialog-container',
      data: { article: article }
    });
    // Future: Open article in a dialog and log user interaction

    // // After clicking on an article, trigger a quiz to gather feedback
    // this.openQuiz();
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

  submitQuizAnswer(question: string, answer: string) {
    console.log(`User answered quiz ${question} with: ${answer}`);
    // You can send the quiz answer to the backend or process it here
  }
  
}