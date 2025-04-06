import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {
  DeliveriesService,
  ProductAdded,
  OrderCreated
} from "../../services/deliveries.service";

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle,
    CommonModule, FormsModule, TranslateModule,
  ]

})
export class OrderConfirmationComponent implements OnInit {
  detallePedido: ProductAdded[] = [];
  orderId: string = '';

  constructor(private deliveryService : DeliveriesService, private router: Router) {}

  ngOnInit(): void {
    const orderString = localStorage.getItem('order');
    if (orderString) {
      const order: OrderCreated = JSON.parse(orderString);
      this.orderId = order.id;
      this.detallePedido = order.items;
    }
  }

  terminoBusqueda: string = '';

  get detalleFiltrado(): any[] {
    if (!this.terminoBusqueda) return this.detallePedido;
    return this.detallePedido.filter(item =>
      item.product_name.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
  }

  obtenerTotalPedido(): number {
    return this.detallePedido.reduce((total, item) => total + item.subtotal, 0);
  }

  orderConfirmation(): void {
    this.deliveryService.confirmOrder(this.orderId).subscribe({
      next: (response) => {
        console.log('Order confirmed:', response);
        alert('Order confirmed successfully!');
        localStorage.removeItem('order');
        this.router.navigate(['/home-client']);
      },
      error: (error) => {
        console.error('Error confirming order:', error);
        alert('Error confirming order. Please try again.');
      }
    });
  }

}
