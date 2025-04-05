import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule, IonicModule],
})
export class DeliveriesComponent   {

  productos = [
    { id: 1, nombre: 'Manzanas', stock: 20, precio: 2500 },
    { id: 2, nombre: 'Peras', stock: 15, precio: 3000 },
    { id: 3, nombre: 'Bananas', stock: 10, precio: 1500 },
    { id: 4, nombre: 'Naranjas', stock: 12, precio: 2800 },
  ];

  // Variables de control
  cantidadDeseada: number = 0;
  productoSeleccionado: any = null;
  detallePedido: any[] = [];

  // Búsqueda
  terminoBusqueda: string = '';

  // Seleccionar producto desde el card
  seleccionarProducto(producto: any): void {
    this.productoSeleccionado = producto;
    this.cantidadDeseada = 0;
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
    const precioTotal = this.cantidadDeseada * this.productoSeleccionado.precio;
    this.detallePedido.push({
      id: this.productoSeleccionado.id,
      nombre: this.productoSeleccionado.nombre,
      cantidad: this.cantidadDeseada,
      precioUnitario: this.productoSeleccionado.precio,
      precioTotal: precioTotal
    });

    // Limpiar selección
    this.cantidadDeseada = 0;
    this.productoSeleccionado = null;
  }

  // Confirmar orden (podrías aquí enviar al backend)
  confirmarOrden(): void {
    if (this.detallePedido.length === 0) {
      alert('Agrega productos al pedido antes de confirmar.');
      return;
    }

    console.log('Pedido confirmado:', this.detallePedido);
    alert('¡Pedido confirmado con éxito!');

    // Reiniciar
    this.detallePedido = [];
    this.cantidadDeseada = 0;
    this.productoSeleccionado = null;
  }

  // Filtrado de productos según término
  get productosFiltrados() {
    if (!this.terminoBusqueda.trim()) {
      return this.productos;
    }

    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
  }

  limpiarCantidad(): void {
    this.cantidadDeseada = 0;
  }

}
