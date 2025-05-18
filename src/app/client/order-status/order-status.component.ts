// src/app/client/order-status/order-status.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  status: string;
}

interface Order {
  id: string;
  client_id: string;
  seller_id: string;
  state: string;
  total: number;
  deliver_date: string | null;
  created_at: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, RouterLink, TranslatePipe],
})
export class OrderStatusComponent implements OnInit {
  orders: Order[] = [];
  user_id: string | null = null;
  user_email: string | null = null;
  last_buy = '';

  constructor(private http: HttpClient) {
    this.user_id = <string>localStorage.getItem('user_id');
    this.user_email = <string>localStorage.getItem('user_email');
  }

  ngOnInit(): void {
    this.http
      .get<Order[]>('https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/orders')
      .subscribe({
        next: (data) => {
          this.orders = data.filter(order => order.client_id === this.user_id).sort((a, b) => (a.state === 'OrderDelivered' ? 1 : b.state === 'OrderDelivered' ? -1 : 0));
          this.last_buy = this.orders.length > 0 ? this.orders[0].created_at : '';
        },
        error: (err) => {
          console.error('Error fetching orders:', err);
        }
      });
  }

  saveOrderId(orderId: string): void {
    localStorage.setItem('order_id', orderId);
  }
}
