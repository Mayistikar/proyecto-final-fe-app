import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ClientVisitService } from 'src/app/services/client-visit.service';

@Component({
  selector: 'app-client-visit',
  templateUrl: './client-visit.component.html',
  styleUrls: ['./client-visit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  providers:[ClientVisitService]
})
export class ClientVisitPage {
  clientId: string = '';
  sellerId: string = '';
  visitDate: string = '';
  duration: number = 0;
  comments: string = '';
  results: string = '';
  clients: any[] = [];

  constructor(private clientVisitService: ClientVisitService, private router: Router) {
    this.loadClients();
  }

  loadClients() {
    this.clientVisitService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        // Manejar el error apropiadamente (mostrar mensaje al usuario, etc.)
      },
    });
  }

  setResult(result: string) {
    this.results = result;
  }

  registerClientVisit() {
    if (!this.clientId || !this.sellerId || !this.visitDate || this.duration <= 0 || !this.comments || !this.results) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    this.clientVisitService
      .registerClientVisit(
        this.clientId,
        this.sellerId,
        this.visitDate,
        this.duration,
        this.comments,
        this.results
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
