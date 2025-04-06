import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DeliveriesService, Product, Order, OrderItem } from 'src/app/services/deliveries.service';
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
    client_id: '',
    seller_id: '53ceb643-0af6-49b2-90c1-96b328359ac6',
    items: []
  }
  constructor(private deliveryService : DeliveriesService, private router: Router) {
    this.order.client_id = <string>localStorage.getItem('user_id');
    console.log({order: this.order});

    this.cargarProductos();
  }

  productos: Product[] = [];

  // Variables de control
  cantidadDeseada: number = 0;
  productoSeleccionado: any = null;
  detallePedido: any[] = [];

  // Búsqueda
  terminoBusqueda: string = '';

  // Seleccionar producto desde el card
  seleccionarProducto(producto: Product): void {
    this.productoSeleccionado = producto;
    this.cantidadDeseada = 0;
    console.log('Producto seleccionado:', producto);
  }

  cargarProductos(): void {
    this.deliveryService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos cargados:', this.productos);
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
      id: this.productoSeleccionado.id,
      name: this.productoSeleccionado.name,
      quantity: this.cantidadDeseada,
      unitPrice: this.productoSeleccionado.price,
      total: precioTotal
    });
    console.log('Detalle pedido actualizado:', this.detallePedido);

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
        product_id: producto.id,
        quantity: producto.quantity
      })
    })

    console.log('Pedido confirmado:', this.order);
    console.log('Detalle pedido actualizado:', this.detallePedido);
    alert('¡Pedido confirmado con éxito!');

    localStorage.setItem('order', JSON.stringify(this.detallePedido));

    this.deliveryService.addOrderToCart(this.order).subscribe(
      (response) => {
        console.log('Pedido enviado:', response);
        alert('Pedido enviado con éxito.');
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
    const total = this.detallePedido.reduce((sum, item) => sum + Number(item.total), 0);
    console.log('Total calculado:', total);
    return total;
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
  }

  limpiarCantidad(): void {
    this.cantidadDeseada = 0;
  }

}
