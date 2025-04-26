import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';


export interface AssignedClient {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssignedClientsService {
  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod'; // cambia esto a tu backend real

  constructor(private http: HttpClient) {}

  getClients(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/api/clients`).pipe(
      tap(clients => console.log('Clientes  obtenidos:', clients)),
      catchError((error)=>{
        console.error('Error al obtener clientes :', error);
        return throwError(() => error);
      })
    );
  }

 

  // getAssignedClients(): Observable<AssignedClient[]> {
  //   const sellerId = localStorage.getItem('user_id');
  
  //   if (!sellerId) {
  //     console.error('No se encontró el ID del vendedor en localStorage.');
  //     return throwError(() => new Error('No se encontró el ID del vendedor'));
  //   }
  
  //   const url = `${this.apiUrl}/api/sellers/${sellerId}/clients`;
  
  //   return this.http.get<AssignedClient[]>(url).pipe(
  //     tap(clients => console.log('Clientes asignados obtenidos:', clients)),
  //     catchError((error) => {
  //       console.error('Error al obtener clientes:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }
  
  getAssignedClients(): Observable<AssignedClient[]> {
    const sellerId = localStorage.getItem('user_id');
  
    if (!sellerId) {
      console.error('No se encontró sellerId en localStorage');
      return throwError(() => new Error('No sellerId available'));
    }
  
    const url = `${this.apiUrl}/api/sellers/${sellerId}/clients`;
  
    return this.http.get<{ sellerId: string; clients: AssignedClient[]; message: string }>(url).pipe(
      tap(response => console.log('Clientes asignados obtenidos:', response)),
      // Nos quedamos solo con la propiedad clients
      map(response => response.clients),
      catchError(error => {
        console.error('Error al obtener clientes:', error);
        return throwError(() => error);
      })
    );
  }
  

  postAssignedClients(sellerId: string, clients: AssignedClient[]): Observable<any> {
    const url = `${this.apiUrl}/api/sellers/clients`; // URL que me diste
    const body = {
      sellerId: sellerId,
      clients: clients.map(client => ({
        id: client.id,
        name: client.name,
        address: client.address,
        phone: client.phone,
        notes: client['notes'] || '' // Aseguramos el campo notes
      }))
    };
  
    return this.http.post(url, body).pipe(
      tap(response => console.log('Clientes asignados exitosamente:', response)),
      catchError(error => {
        console.error('Error al asignar clientes:', error);
        return throwError(() => error);
      })
    );
  }
  

}

