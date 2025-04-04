import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClientVisitService {

  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod'; // URL de MockAPI

  constructor(private http:HttpClient) { }

  registerClientVisit(client_id: string, seller_id: string, visit_datetime: Date, duration_minutes:number,observations: string, result: string):Observable<any> {
    const body = { client_id, seller_id, visit_datetime, duration_minutes, observations, result };

    return this.http.post(`${this.apiUrl}/api/visits`, body).pipe(
      tap(()=> console.log('Visita registrada con éxito')),
      catchError((error) => {
        console.error('Error al registrar visita:', error);
        return throwError(()=> error);}));
  }

  getClients():Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }
}
