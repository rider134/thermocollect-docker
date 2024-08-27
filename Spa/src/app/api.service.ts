import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Facade } from './models/facade' 
import { DataResponse } from './models/response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  facadesUrl = 'api/facades';
  facadeUrl = 'api/facade';
  commandUrl = 'api/command';

  constructor(private http: HttpClient) { }

  getFacades() {
    return this.http.get<Facade[]>(this.facadesUrl)
    .pipe(
      catchError(this.handleError)
    );
  }

  getFacade(id: number) {
    const url = `${this.facadeUrl}/${id}`; 
    return this.http.get<Facade>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  putFacades(facade: Facade) {
    const url = `${this.facadeUrl}/${facade.id}`; 
    return this.http.put<DataResponse>(url, facade)
      .pipe(
        catchError(this.handleError)
      );
  }

  putCommand(command: string) {
    return this.http.put<DataResponse>(this.commandUrl, {"message":command})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(error.error.message))
  }
}
