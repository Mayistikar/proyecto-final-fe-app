import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface Order {
  client_id: string;
  seller_id: string;
  items: OrderItem[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveriesService {

  private apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api'; // URL de MockAPI

  constructor(private http:HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  addOrderToCart(order: Order) {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }
}
