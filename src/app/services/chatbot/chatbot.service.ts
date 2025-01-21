import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8000/chatbot';

  constructor(private http: HttpClient) {}

  submitQuestion(question: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, { question }, { headers }).pipe(
      // Catch and handle errors from the API
      catchError((error) => {
        console.error('Error occurred while communicating with the chatbot API:', error);
        return throwError(() => new Error('Failed to get a response from the chatbot API. Please try again later.'));
      })
    );
  }
}