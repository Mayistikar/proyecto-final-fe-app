import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScheduledDeliveriesService } from 'src/app/services/scheduled-deliveries.service';

@Component({
  selector: 'app-scheduled-deliveries',
  templateUrl: './scheduled-deliveries.component.html',
  styleUrls: ['./scheduled-deliveries.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ScheduledDeliveriesComponent implements OnInit {

  constructor(private scheduledDeliveriesService: ScheduledDeliveriesService) { }

  clientId = '8c0933cd-9a1d-40fb-8b89-5e3578582f6c';
  deliveries: any[] = [];
  allDeliveries: any[] = [];

  // ngOnInit(): void {
  //   console.log('ngOnInit ejecutado');
  //   this.scheduledDeliveriesService.getOrdersByClientId(this.clientId).subscribe(
  //     (res: any) => {
  //       console.log('Respuesta del servicio:', res);
  //       this.deliveries = res;
  //     },
  //     (error: any) => {
  //       console.error('Error obteniendo órdenes:', error);
  //     }
  //   );
  // }

  // ngOnInit(): void {
  //   console.log('ngOnInit ejecutado');
  //   this.scheduledDeliveriesService.getOrdersByClientId(this.clientId).subscribe(
  //     (res: any) => {
  //       console.log('Respuesta del servicio:', res);
  //       this.allDeliveries = res;
  //       this.deliveries = res;
  //     },
  //     (error: any) => {
  //       console.error('Error obteniendo órdenes:', error);
  //     }
  //   );
  // }


  ngOnInit(): void {
    console.log('ngOnInit ejecutado (modo mock)');

    this.deliveries = [
      {
        order_id: '123e4567-e89b-12d3-a456-426614174001',
        order_data: {
          products: [
            {
              id: 'abc123',
              name: 'Cámara DSLR',
              quantity: 1,
              price: 2500.00
            }
          ],
          total: 2560.00
        },
        delivery_date: '2025-05-15',
        client_address: 'Carrera 15 #82-45'
      },
      {
        order_id: '456fgh78-1234-5678-aaaa-bbbbccccdddd',
        order_data: {
          products: [
            {
              id: 'def456',
              name: 'Lente 50mm',
              quantity: 2,
              price: 800.00
            }
          ],
          total: 1600.00
        },
        delivery_date: '2025-05-20',
        client_address: 'Calle 100 #10-20'
      }
    ];
    this.allDeliveries = [...this.deliveries];
  }



  showCalendar = false;
  selectedDate: string | null = null;

  openCalendar() {
    this.showCalendar = true;
  }

  onDateSelected(event: any) {
    this.selectedDate = event.detail.value;
    console.log('Fecha seleccionada:', this.selectedDate);

    if (!this.selectedDate) {
      return; // no hagas nada si no se seleccionó una fecha
    }

    const selected = new Date(this.selectedDate).toISOString().split('T')[0]; // YYYY-MM-DD

    this.deliveries = this.allDeliveries.filter(entrega => {
      const entregaDate = new Date(entrega.delivery_date).toISOString().split('T')[0];
      return entregaDate === selected;
    });

    this.showCalendar = false;
  }
  clearDate() {
    this.selectedDate = null;
    this.deliveries = this.allDeliveries;
    this.showCalendar = false;
  }



}

