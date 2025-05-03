import { AfterViewInit, Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackService } from '../services/feedback/feedback.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface Feedback {
  documentId?: string;
  starRating?: number;
  reaction?: string;
  comments?: string;
  quiz?: {
    quiz_question: string;
    quiz_options: string;
    selected_value: string;
  };
}

@Component({
  selector: 'app-article-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [MatSnackBar],
  templateUrl: './article-detail-dialog.component.html',
  styleUrl: './article-detail-dialog.component.scss'
})
export class ArticleDetailDialogComponent implements AfterViewInit {
  // Built using Angular Material documentation: https://material.angular.dev/components/categories
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  article: any;
  
  feedback: Feedback = {
    documentId: '',
    starRating: 0,
    reaction: '',
    comments: '',
  };

  constructor(
    public dialogRef: MatDialogRef<ArticleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { article: any, userId: string, sessionId: string },
    private feedbackService: FeedbackService, private snackBar: MatSnackBar
  ) {
    this.article = data.article;
    this.feedback.documentId = this.data.article.document_id;
  }

  ngAfterViewInit(): void {
    // Reset the scroll position of the dialog content to the top
    this.dialogRef.afterOpened().subscribe(() => {
     setTimeout(() => {
    if (this.contentContainer && this.contentContainer.nativeElement) {
      this.contentContainer.nativeElement.scrollTop = 0;
    }
     }, 0);
        });
  }

  isString(value: any): boolean {
  return typeof value === 'string';
  }

  formatKey(key: unknown): string {
  return key !== null && key !== undefined ? String(key) : '';
  }

  getSectionContent(value: unknown): string {
  if (value && typeof value === 'object' && 'text' in value) {
    // TypeScript now knows value is an object with a text property
    return (value as { text: string }).text;
  }
  return value !== null && value !== undefined ? String(value) : '';
  }
  
  removeTitleTags(html: string): string {
  // Use a regex to remove the <title> element and its content
  return html.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '');
  }

  // Sets the star rating based on the clicked star
  setStarRating(star: number): void {
    this.feedback.starRating = star;
  }

  // Sets the emoticon reaction
  setReaction(reaction: string): void {
    this.feedback.reaction = reaction;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmitFeedback(): void {
    this.feedbackService.sendFeedback(this.feedback, this.data.userId, this.data.sessionId)
    .subscribe({
      next: (response: any) => {
        console.log("Feedback submitted:", response);
        this.snackBar.open('Feedback has been submitted!', 'Dismiss', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.dialogRef.close(this.feedback);
      },
      error: (error: any) => {
        console.error("Error submitting feedback:", error);
        this.snackBar.open('Error submitting feedback. Please try again.', 'Dismiss', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
}
}