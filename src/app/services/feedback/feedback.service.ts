import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FeedbackPayload {
  user_id: string;
  session_id: string;
  feedback: {
    document_id?: string,
    ratings?: number;
    reactions?: string;
    comments?: string;
    quiz?: { quiz_question?: string, quiz_options?: string, quiz_result?: string; }
  };
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = 'http://localhost:8000';
  private submitFeedbackEndpoint = `${this.baseUrl}/submit-feedback`; // Endpoint for submitFeedback interactions

  constructor(private http: HttpClient) { }

  sendRating(feedback: { documentId: string, score: number }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: { document_id: feedback.documentId, ratings: feedback.score }
    };
    return this.http.post(this.submitFeedbackEndpoint, payload);
  }

  sendReaction(feedback: { documentId: string, reaction: string }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: { document_id: feedback.documentId, reactions: feedback.reaction }
    };
    return this.http.post(this.submitFeedbackEndpoint, payload);
  }

  sendFeedback(feedback: { documentId?: string, starRating?: number; reaction?: string; comments?: string, quiz?: { quiz_question: string, quiz_options: string, selectedValue: string } }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: {
        // document_id: feedback.documentId,
        // ratings: feedback.starRating,
        // reactions: feedback.reaction,
        // comments: feedback.comments
      }
    };
    if (feedback && feedback.documentId) {
    payload.feedback = {
      document_id: feedback.documentId,
      ratings: feedback.starRating,
      reactions: feedback.reaction,
      comments: feedback.comments
    };
  }
  // Add quiz feedback if quiz exists
  if (feedback.quiz) {
    payload.feedback.quiz = {
      quiz_question: feedback.quiz.quiz_question,
      quiz_options: feedback.quiz.quiz_options,
      quiz_result: feedback.quiz.selectedValue
    };
  }
  return this.http.post(this.submitFeedbackEndpoint, payload, {
    params: {
      user_id: user_id,
      session_id: session_id
    }
  });
  }

  sendQuizFeedback(quiz: { quiz_question: string, quiz_options: string, selectedValue: string }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: { quiz: { quiz_question: quiz.quiz_question, quiz_options: quiz.quiz_options, quiz_result: quiz.selectedValue } }
    };
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(this.submitFeedbackEndpoint, payload, { headers });
  }
}
