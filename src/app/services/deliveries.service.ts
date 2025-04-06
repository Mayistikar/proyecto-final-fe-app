import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  private apiUrl = 'https://67e8565920e3af747c4108d1.mockapi.io/api/v1'; // URL de MockAPI

  constructor(private http:HttpClient) { }

  getProducts() {
    return this.http.get<any[]>(`${this.apiUrl}/product`);
  }


}
