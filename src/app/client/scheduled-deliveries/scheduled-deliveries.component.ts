import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScheduledDeliveriesService } from 'src/app/services/scheduled-deliveries.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scheduled-deliveries',
  templateUrl: './scheduled-deliveries.component.html',
  styleUrls: ['./scheduled-deliveries.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, TranslateModule],
})
export class ScheduledDeliveriesComponent implements OnInit {

  constructor(private scheduledDeliveriesService: ScheduledDeliveriesService) { }

  clientId = localStorage.getItem('user_id') || '';
  deliveries: any[] = [];
  allDeliveries: any[] = [];

  ngOnInit(): void {
    console.log('ngOnInit ejecutado');
    this.scheduledDeliveriesService.getOrdersByClientId(this.clientId).subscribe(
      (res: any) => {
        console.log('Respuesta del servicio:', res);
        this.allDeliveries = res || [];
        this.applyAllFilters(); // Aplicar filtros al cargar
      },
      (error: any) => {
        console.error('Error obteniendo órdenes:', error);
        this.allDeliveries = [];
        this.deliveries = [];
      }
    );
  }

  showCalendar = false;
  selectedDate: string | null = null;
  searchTerm: string = '';

  openCalendar() {
    this.showCalendar = true;
  }

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
    console.log('Fecha seleccionada:', this.selectedDate);
    this.showCalendar = false;
    this.applyAllFilters();
  }

  clearDate() {
    this.selectedDate = null;
    this.applyAllFilters();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyAllFilters();
  }

  // ✅ Función para formatear la fecha en formato YYYY-MM-DD (local)
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getFilteredByDate(deliveriesToFilter: any[]): any[] {
    if (!this.selectedDate) {
      return [...deliveriesToFilter];
    }

    // ⚠️ Solo tomar los primeros 10 caracteres para obtener YYYY-MM-DD sin zona horaria
    const selected = this.selectedDate.substring(0, 10);

    return deliveriesToFilter.filter(entrega => {
      if (!entrega.delivery_date) return false;

      // También limitar delivery_date a YYYY-MM-DD sin parsearlo con Date()
      const entregaDate = entrega.delivery_date.substring(0, 10);

      console.log('🧪 Comparando:', entregaDate, 'con', selected);
      return entregaDate === selected;
    });
  }


  applyAllFilters() {
    let filteredByDate = this.getFilteredByDate(this.allDeliveries);
    const currentSearchTerm = this.searchTerm.trim();

    if (!currentSearchTerm) {
      this.deliveries = filteredByDate;
    } else {
      const numPedido = parseInt(currentSearchTerm, 10);

      if (!isNaN(numPedido) && numPedido > 0) {
        if (numPedido >= 1 && numPedido <= filteredByDate.length) {
          this.deliveries = [filteredByDate[numPedido - 1]];
        } else {
          this.deliveries = [];
        }
      } else {
        this.deliveries = [];
      }
    }

    console.log('✅ Entregas finales a mostrar:', JSON.parse(JSON.stringify(this.deliveries)));
    if (this.deliveries.length === 0 && currentSearchTerm) {
      console.log('⚠️ No se encontraron entregas para el término de búsqueda:', currentSearchTerm);
    }
  }

  isNotANumber(value: any): boolean {
    return isNaN(value);
  }

  selectedDelivery: any = null;
  showModal = false;

  openDeliveryDetails(delivery: any) {
    this.selectedDelivery = delivery;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedDelivery = null;
  }
}


