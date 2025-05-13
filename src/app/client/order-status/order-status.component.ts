// src/app/client/order-status/order-status.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Order {
  id: string;
  number: string;
  status: string;
  date: string;
  // Add other fields as needed
}

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule],
})
export class OrderStatusComponent implements OnInit {
  orders: Order[] = [];
  clientName = 'Nombre del cliente'; // Replace with actual client data if available

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Order[]>('https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/orders?client_id=ed4a9df5-15ce-4e91-a45a-9b1f90e515a4')
      .subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (err) => {
          console.error('Error fetching orders:', err);
        }
      });
  }
}
