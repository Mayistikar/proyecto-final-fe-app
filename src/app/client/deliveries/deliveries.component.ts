import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule, IonicModule],
})
export class DeliveriesComponent   {

  constructor(private deliveryService : DeliveriesService, private router: Router) {
    this.cargarProductos();
  }

  productos: any[] = [];




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
    console.log('Producto seleccionado:', producto);
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
    const precioTotal = this.cantidadDeseada * this.productoSeleccionado.precio;
    this.detallePedido.push({
      id: this.productoSeleccionado.id,
      nombre: this.productoSeleccionado.nombre,
      cantidad: this.cantidadDeseada,
      precioUnitario: this.productoSeleccionado.precio,
      precioTotal: precioTotal
    });
    console.log('Detalle pedido actualizado:', this.detallePedido);

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

    // Guardar el detalle del pedido en localStorage
    localStorage.setItem('detallePedidoConfirmado', JSON.stringify(this.detallePedido));

    // Opcional: navegar a la página de confirmación
    this.router.navigate(['/order-confirmation']); // Asegúrate que la ruta existe

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
  obtenerTotalPedido(): number {
    const total = this.detallePedido.reduce((sum, item) => sum + Number(item.precioTotal), 0);
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
