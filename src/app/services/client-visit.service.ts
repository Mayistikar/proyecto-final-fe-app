import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ClientVisitService {

  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod'; // URL de MockAPI

  constructor(private http:HttpClient) { }

  registerClientVisit(client_id: string, seller_id: string, visit_datetime: Date, duration_minutes:number,observations: string, result: string) {
    const body = { client_id, seller_id, visit_datetime, duration_minutes, observations, result };

    return this.http.post(`${this.apiUrl}/api/visits`, body);
  }

  getClients() {
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }
}
