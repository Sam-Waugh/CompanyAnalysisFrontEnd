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
  private endpointUrl = '/submit-feedback';

  constructor(private http: HttpClient) { }

  sendRating(feedback: { documentId: string, score: number }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: { document_id: feedback.documentId, ratings: feedback.score }
    };
    return this.http.post(this.endpointUrl, payload);
  }

  sendReaction(feedback: { documentId: string, reaction: string }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: { document_id: feedback.documentId, reactions: feedback.reaction }
    };
    return this.http.post(this.endpointUrl, payload);
  }

  sendFeedback(feedback: { documentId: string, starRating: number; reaction: string; comments: string }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: {
        document_id: feedback.documentId,
        ratings: feedback.starRating,
        reactions: feedback.reaction,
        comments: feedback.comments
      }
    };
    return this.http.post(this.endpointUrl, payload);
  }

  sendQuizFeedback(quiz: { quiz_question: string, quiz_options: string, selectedValue: string }, user_id: string, session_id: string): Observable<any> {
    const payload: FeedbackPayload = {
      user_id: user_id,
      session_id: session_id,
      feedback: { quiz: { quiz_question: quiz.quiz_question, quiz_options: quiz.quiz_options, quiz_result: quiz.selectedValue } }
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.endpointUrl, payload, { headers });
  }
}
