import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AssignedClient {
  id: string;
  name: string;
  address: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssignedClientsService {
  private apiUrl = 'https://67e8565920e3af747c4108d1.mockapi.io/api/v1'; // cambia esto a tu backend real

  constructor(private http: HttpClient) {}

  getAssinedClients(): Observable<AssignedClient[]> {
    return this.http.get<AssignedClient[]>(`${this.apiUrl}/clients`).pipe(
      tap(clients => console.log('Clientes asignados obtenidos:', clients)),
      catchError((error)=>{
        console.error('Error al obtener clientes asignados:', error);
        return throwError(() => error);
      })
    );
  }

}

