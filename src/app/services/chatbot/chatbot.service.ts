import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://localhost:8000';
  private chatbotEndpoint = `${this.baseUrl}/chatbot`; // Endpoint for chatbot interactions
  private authorsEndpoint = `${this.baseUrl}/authors`;

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any>(`${this.authorsEndpoint}`, { headers }).pipe(
      tap(response => console.log('Authors fetched:', response)),
      catchError(this.handleError)
    );
  }

/**
   * Starts a new chatbot session and fetches the first question.
   * @returns Observable<any> - The backend's initial question.
   * RxJS guidance used: https://rxjs.dev/guide/overview
   */
  startChatSession(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.chatbotEndpoint}`, {}, { headers }).pipe(
      tap(response => console.log('Chat session started:', response)),
      catchError(this.handleError)
    );
  }

  /**
   * Submits user responses to the chatbot backend.
   * @param sessionId - Unique session identifier for the user.
   * @param userResponse - The user's response to the current chatbot question.
   * @returns Observable<any> - The backend's response.
   * RxJS guidance used: https://rxjs.dev/guide/overview
   */
  submitChatbotResponse(sessionId: string, userId: string, selectedAuthorId: string | null, userResponse: string | null): Observable<any> {
    const payload = {
      session_id: sessionId,
      user_id: userId,
      selected_author_id: selectedAuthorId,
      user_response: userResponse,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.chatbotEndpoint, payload, { headers }).pipe(
      map((response) => {
        // Log and return the response for debugging or additional processing
        console.log('ChatbotService response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches the next question for a given session.
   * @param sessionId - Unique session identifier for the user.
   * @returns Observable<any> - The backend's response with the next question.
   * RxJS guidance used: https://rxjs.dev/guide/overview
   */
  getNextQuestion(sessionId: string, userId: string, userResponse: string = ''): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { session_id: sessionId, user_id: userId, user_response: userResponse };

    return this.http.post<any>(`${this.chatbotEndpoint}`, requestBody, { headers }).pipe(
      tap(response => console.log('Next question response:', response)),
      catchError(this.handleError)
    );
  }
  /**
   * Sends user feedback to the backend.
   * @param sessionId - Unique session identifier for the user.
   * @param feedback - User feedback on the chatbot's response or generated content.
   * @returns Observable<any> - The backend's response.
   * RxJS guidance used: https://rxjs.dev/guide/overview
   */
  submitUserFeedback(sessionId: string, userId: string, feedback: string): Observable<any> {
    const payload = {
      session_id: sessionId,
      user_id: userId,
      feedback: feedback,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.chatbotEndpoint}/feedback`, payload, { headers }).pipe(
      map((response) => {
        console.log('Feedback submission response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }
  
 /**
   * Handles errors from HTTP requests.
   * @param error - The error response object.
   * @returns Observable<never> - Throws a user-friendly error message.
   * RxJS guidance used: https://rxjs.dev/guide/overview
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error in ChatbotService:', error);

    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      errorMessage = `Server returned code ${error.status}, error message: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}