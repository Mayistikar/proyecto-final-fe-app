import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface Order {
  id: string;
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


export interface OrderCreated {
  id: string;
  client_id: string;
  seller_id: string;
  state: string;
  total: number;
  deliver_date: string | null;
  created_at: string;
  items: ProductAdded[];
}

export interface ProductAdded {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  status: string;
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

  addOrderToCart(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  confirmOrder(orderID:string): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/${orderID}/confirm`, {});
  }
}
