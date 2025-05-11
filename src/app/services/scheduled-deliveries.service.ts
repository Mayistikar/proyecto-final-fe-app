import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduledDeliveriesService {

  private baseUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/orders';

  constructor(private http: HttpClient) { }

  getOrdersByClientId(clientId: string): Observable<any[]> {
    const url = `${this.baseUrl}/client_id/${clientId}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error al obtener pedidos:', error);
    return throwError(() => new Error('Ocurrió un error al obtener los pedidos del cliente.'));
  }
}

