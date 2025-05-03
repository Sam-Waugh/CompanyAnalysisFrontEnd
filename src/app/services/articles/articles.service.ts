import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private baseUrl = 'http://localhost:8000';
  private articlesEndpoint = `${this.baseUrl}/articles`; // Endpoint for article retrieval
  private articleReadEndpoint = `${this.baseUrl}/articleRead`;

  constructor(private http: HttpClient) { }
  
  /**
   * Fetches articles from backend.
   * @param userId - Unique identifier for the user.
   * @returns Observable<any> - The backend's response with the list of articles.
   * RxJS guidance used: https://rxjs.dev/guide/overview
   */
  getArticles(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { user_id: userId };

    return this.http.get<any>(`${this.articlesEndpoint}?user_id=${userId}`, { headers }).pipe(
      tap(response => console.log('Articles fetched:', response)),
      catchError(this.handleError)
    );
  }

  markArticleAsRead(documentId: string):  Observable<any> {
    const url = `${this.articleReadEndpoint}`;
    // Using PATCH to update the isUnread property to false
    return this.http.post(url, { document_id: documentId });
  }
    
 /**
   * Handles errors from HTTP requests.
   * @param error - The error response object.
   * @returns Observable<never> - Throws a user-friendly error message.
   * RxJS guidance used: https://rxjs.dev/guide/overview
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error in ArticlesService:', error);

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