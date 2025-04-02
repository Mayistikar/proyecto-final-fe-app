import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ClientVisitService {

  private apiUrl = 'https://67e8565920e3af747c4108d1.mockapi.io/api/v1'; // URL de MockAPI

  constructor(private http:HttpClient) { }

  registerClientVisit(clientId: string, sellerId: string, visitDate: string, duration:number,comments: string, results: string) {
    const body = { clientId, sellerId, visitDate, duration, comments, results };
    
    return this.http.post(`${this.apiUrl}/client-visit`, body);
  }

  getClients() {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }
}
