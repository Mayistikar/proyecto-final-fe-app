// src/app/services/daily-route.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyRouteService {
  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api';

  constructor(private http: HttpClient) {}

  getClientsBySellerId(sellerId: string): Observable<{ clients: any[] }> {
    return this.http.get<{ clients: any[] }>(`${this.apiUrl}/sellers/${sellerId}/clients`);
  }

  getVisitsBySellerEmail(email: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/visits/seller/${email}`).pipe(
      map(response => response.visits || [])
    );
  }

  getVisitsBySellerAndDate(email: string, date: string): Observable<any[]> {
    return this.getVisitsBySellerEmail(email).pipe(
      map((visits) =>
        (visits || []).filter(
          (visit) =>
            new Date(visit.visit_date).toDateString() === new Date(date).toDateString()
        )
      )
    );
  }
}
