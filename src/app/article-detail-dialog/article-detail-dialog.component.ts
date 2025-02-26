import { Component, Inject } from '@angular/core';
import { NgModule } from '@angular/core';
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
  ],
  templateUrl: './article-detail-dialog.component.html',
  styleUrl: './article-detail-dialog.component.scss'
})
export class ArticleDetailDialogComponent {
  feedback: Feedback = {
    documentId: '',
    starRating: 0,
    reaction: '',
    comments: '',
  };

  constructor(
    public dialogRef: MatDialogRef<ArticleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { article: any, userId: string, sessionId: string },
    private feedbackService: FeedbackService
  ) {
    this.feedback.documentId = this.data.article.document_id;
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
        this.dialogRef.close(this.feedback);
      },
      error: (error: any) => {
        console.error("Error submitting feedback:", error);
      }
    });
}
}