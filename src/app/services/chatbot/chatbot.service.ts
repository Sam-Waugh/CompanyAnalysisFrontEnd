import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8000/chatbot';

  constructor(private http: HttpClient) {}

  // submitQuestion(question: string, industry: string, businessGoal: string): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const body = { question, industry, businessGoal };

  //   return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
  //     map(response => response), // Pass the API response directly
  //     // Catch and handle errors from the API
  //     catchError((error) => {
  //       console.error('Error occurred while communicating with the chatbot API:', error);
  //       return throwError(() => new Error('Failed to get a response from the chatbot API. Please try again later.'));
  //     })
  //   );
  // }

  submitChatbotResponse(sessionId: string, userResponse: string | null): Observable<any> {
    const payload = {
      session_id: sessionId,
      user_response: userResponse,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.apiUrl, payload, { headers }).pipe(
      catchError((error) => {
        console.error('Error in ChatbotService:', error);
        // Transform the error into a user-friendly message or rethrow it
        return throwError(() => new Error('An error occurred while processing your request. Please try again later.'));
      })
    );
  }
  
}