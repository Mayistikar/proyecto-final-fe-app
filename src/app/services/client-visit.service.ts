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

  registerClientVisit(payload: any):Observable<any> {
    return this.http.post(`${this.apiUrl}/api/visits`, payload).pipe(
      tap(()=> console.log('Visita registrada con éxito')),
      catchError((error) => {
        console.error('Error al registrar visita:', error);
        return throwError(()=> error);}));
  }

  getClients():Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/visits/seller/vendedor_authorized@example.com`).pipe(
      tap((clients) => console.log('Clientes obtenidos:', clients)),
      catchError((error) => {
        console.error('Error al obtener clientes:', error);
        return throwError(() => error);
      })
    );
  }
}
