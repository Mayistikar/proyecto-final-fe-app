import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClientVisitService } from 'src/app/services/client-visit.service';

export enum VisitResult {
  INTERESTED = 'Interesado',
  NOT_INTERESTED = 'No interesado',
  FOLLOW_UP = 'Seguimiento'
}

@Component({
  selector: 'app-client-visit',
  templateUrl: './client-visit.component.html',
  styleUrls: ['./client-visit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  providers:[ClientVisitService]
})
export class ClientVisitPage {
  seller_id: string = '';
  client_id: string = '';
  visit_datetime: string = '';
  duration_minutes: number = 0;
  observations: string = '';
  result:VisitResult = VisitResult.NOT_INTERESTED ;
  clients: any[] = [];

  public VisitResult = VisitResult; // Para usar en el HTML

  constructor(private clientVisitService: ClientVisitService, private router: Router) {
    this.seller_id = localStorage.getItem('seller_id') || '';
    // this.loadClients();
  }

  // loadClients() {
  //   this.clientVisitService.getClients().subscribe({
  //     next: (clients) => {
  //       this.clients = clients;
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar clientes:', err);
  //       // Manejar el error apropiadamente (mostrar mensaje al usuario, etc.)
  //     },
  //   });
  // }

  setResult(result: VisitResult) {
    this.result = result;
  }

  registerClientVisit() {
    if (!this.client_id || !this.seller_id || !this.visit_datetime || this.duration_minutes <= 0 || !this.observations || !this.result) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const visitDate = new Date(this.visit_datetime);

    this.clientVisitService
      .registerClientVisit(
        this.client_id,
        this.seller_id,
        visitDate,
        this.duration_minutes,
        this.observations,
        this.result
      )
      .subscribe({
        next: () => {
          alert('Visita registrada exitosamente.');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          alert('Hubo un problema al registrar la visita. Inténtalo nuevamente.');
          console.error(err);
        },
      });
  }
}
