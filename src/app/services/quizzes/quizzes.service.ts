import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  private baseUrl = 'http://localhost:8000';
    private quizzesEndpoint = `${this.baseUrl}/quizzes`; // Endpoint for article retrieval
  
    constructor(private http: HttpClient) { }
    
    /**
     * Fetches articles from backend.
     * @param userId - Unique identifier for the user.
     * @returns Observable<any> - The backend's response with the list of articles.
     */
    getQuizzes(userId: string): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const requestBody = { user_id: userId };
  
      return this.http.get<any>(`${this.quizzesEndpoint}?user_id=${userId}`, { headers }).pipe(
        tap((response: any) => console.log('Quizzes fetched:', response)),
        map((response: any) => response.quizzes || []),
        catchError(this.handleError)
      );
    }
      
   /**
     * Handles errors from HTTP requests.
     * @param error - The error response object.
     * @returns Observable<never> - Throws a user-friendly error message.
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
      console.error('Error in QuizzesService:', error);
  
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
