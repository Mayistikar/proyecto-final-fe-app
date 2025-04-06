import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DeliveriesService, Product, Order, OrderItem, ProductAdded} from 'src/app/services/deliveries.service';
import { Router } from '@angular/router';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
})
export class DeliveriesComponent   {

  order : Order = {
    id: '',
    client_id: '',
    seller_id: '',
    items: []
  }
  constructor(private deliveryService : DeliveriesService, private router: Router) {
    this.order.client_id = <string>localStorage.getItem('user_id');
    this.order.seller_id = <string>localStorage.getItem('user_id');
    this.cargarProductos();
  }

  productos: Product[] = [];

  // Variables de control
  cantidadDeseada: number = 0;
  productoSeleccionado: any = null;
  detallePedido: ProductAdded[] = [];

  // Búsqueda
  terminoBusqueda: string = '';

  // Seleccionar producto desde el card
  seleccionarProducto(producto: Product): void {
    this.productoSeleccionado = producto;
    this.cantidadDeseada = 0;
  }

  cargarProductos(): void {
    this.deliveryService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  // Agregar producto al pedido con verificación de stock
  agregarProducto(): void {
    if (!this.productoSeleccionado) {
      alert('Por favor selecciona un producto.');
      return;
    }

    if (this.cantidadDeseada <= 0) {
      alert('Ingresa una cantidad válida.');
      return;
    }

    if (this.cantidadDeseada > this.productoSeleccionado.stock) {
      alert('La cantidad supera el stock disponible.');
      return;
    }

    // Restar stock
    this.productoSeleccionado.stock -= this.cantidadDeseada;

    // Agregar al detalle del pedido
    const precioTotal = this.cantidadDeseada * this.productoSeleccionado.price;
    this.detallePedido.push({
      product_id: this.productoSeleccionado.id,
      product_name: this.productoSeleccionado.name,
      quantity: this.cantidadDeseada,
      price: this.productoSeleccionado.price,
      subtotal: precioTotal,
      status: 'empty'
    });

    // Limpiar selección
    this.cantidadDeseada = 0;
    this.productoSeleccionado = null;
  }

  confirmarOrden(): void{
    if (this.detallePedido.length === 0) {
      alert('Agrega productos al pedido antes de confirmar.');
      return;
    }

    this.detallePedido.map(producto => {
      this.order.items.push({
        product_id: producto.product_id,
        quantity: producto.quantity
      })
    })

    alert('¡Pedido confirmado con éxito!');


    this.deliveryService.addOrderToCart(this.order).subscribe(
      (response) => {
        localStorage.setItem('order', JSON.stringify(response.order));

        this.detallePedido = [];
        this.cantidadDeseada = 0;
        this.productoSeleccionado = null;
        this.order.items = [];
        this.router.navigate(['/order-confirmation']);
      },
      (error) => {
        console.error('Error al enviar el pedido:', error);
        alert('Error al enviar el pedido.');
      }
    );
    return;
  }

  // Filtrado de productos según término
  get productosFiltrados() {
    if (!this.terminoBusqueda.trim()) {
      return this.productos;
    }

    return this.productos.filter(p =>
      p.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  obtenerTotalPedido(): number {
    const total = this.detallePedido.reduce((sum, item) => sum + Number(item.subtotal), 0);
    return total;
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
  }


}
