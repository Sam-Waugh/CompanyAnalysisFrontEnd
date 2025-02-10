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

export interface Feedback {
  starRating: number;
  emotion: string;
  comments: string;
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
    starRating: 0,
    emotion: '',
    comments: ''
  };

  constructor(
    public dialogRef: MatDialogRef<ArticleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { article: any }
  ) {}

  // Sets the star rating based on the clicked star
  setStarRating(star: number): void {
    this.feedback.starRating = star;
  }

  // Sets the emotion
  setEmotion(emotion: string): void {
    this.feedback.emotion = emotion;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmitFeedback(): void {
    // Here you could send the feedback to a service, log it, etc.
    console.log("Feedback submitted:", this.feedback);
    this.dialogRef.close(this.feedback);
  }
}