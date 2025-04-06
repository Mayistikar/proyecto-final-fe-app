import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss'],
  standalone: true,
  imports: [
    IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle,
    CommonModule, FormsModule, TranslateModule
  ]

})
export class OrderConfirmationComponent implements OnInit {

  ngOnInit(): void {
    const pedidoGuardado = localStorage.getItem('detallePedidoConfirmado');
    if (pedidoGuardado) {
      this.detallePedido = JSON.parse(pedidoGuardado);
      localStorage.removeItem('detallePedidoConfirmado'); // si quieres limpiar
    }
    setInterval(() => console.log("Valor actual del término de búsqueda:", this.terminoBusqueda), 1000);
  }


  detallePedido: any[] = [];


  terminoBusqueda: string = '';

  get detalleFiltrado(): any[] {
    if (!this.terminoBusqueda) return this.detallePedido;
    return this.detallePedido.filter(item =>
      item.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }


  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
  }

  obtenerTotalPedido(): number {
    return this.detallePedido.reduce((total, item) => total + item.precioTotal, 0);
  }

}
