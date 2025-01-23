import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private baseUrl = 'http://localhost:8000';
  private chatbotEndpoint = `${this.baseUrl}/chatbot`; // Endpoint for chatbot interactions

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

  /**
   * Submits user responses to the chatbot backend.
   * @param sessionId - Unique session identifier for the user.
   * @param userResponse - The user's response to the current chatbot question.
   * @returns Observable<any> - The backend's response.
   */
  submitChatbotResponse(sessionId: string, userResponse: string | null): Observable<any> {
    const payload = {
      session_id: sessionId,
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
   * Handles errors from HTTP requests.
   * @param error - The error response object.
   * @returns Observable<never> - Throws a user-friendly error message.
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

  /**
   * Fetches the next question for a given session.
   * @param sessionId - Unique session identifier for the user.
   * @returns Observable<any> - The backend's response with the next question.
   */
  getNextQuestion(sessionId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.chatbotEndpoint}/next-question`;

    return this.http.get<any>(url, { headers, params: { session_id: sessionId } }).pipe(
      map((response) => {
        console.log('Next question response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Sends user feedback to the backend.
   * @param sessionId - Unique session identifier for the user.
   * @param feedback - User feedback on the chatbot's response or generated content.
   * @returns Observable<any> - The backend's response.
   */
  submitUserFeedback(sessionId: string, feedback: string): Observable<any> {
    const payload = {
      session_id: sessionId,
      feedback: feedback,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.chatbotEndpoint}/feedback`;

    return this.http.post<any>(url, payload, { headers }).pipe(
      map((response) => {
        console.log('Feedback submission response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }
}