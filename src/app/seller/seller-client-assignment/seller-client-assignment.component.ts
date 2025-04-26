import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IonHeader,
  IonText,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonList,
  IonAvatar,
  IonLabel
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssignedClientsService } from 'src/app/services/assigned-clients.service'; // Asegúrate que el path sea correcto

interface ClientFromDB {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  created_at: string;
}

interface Client extends ClientFromDB {
  selected?: boolean;
  notes?: string;
}

@Component({
  selector: 'app-seller-client-assignment',
  templateUrl: './seller-client-assignment.component.html',
  styleUrls: ['./seller-client-assignment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SellerClientAssignmentComponent implements OnInit {
  clients: Client[] = [];
  searchText: string = '';
  notes: string = '';

  constructor(private http: HttpClient, private assignedClientsService : AssignedClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }



  loadClients(): void {
    const assigned$ = this.assignedClientsService.getAssignedClients();
    const allClients$ = this.assignedClientsService.getClients();
  
    assigned$.subscribe({
      next: (assignedClients) => {
        allClients$.subscribe({
          next: (allClients) => {
            // Creamos un Set con los IDs de los clientes asignados
            const assignedIds = new Set(assignedClients.map(c => c.id));
  
            // Filtramos: nos quedamos solo con los clientes NO asignados
            this.clients = allClients.filter((client: any) => !assignedIds.has(client.id));
  
            console.log('Clientes disponibles:', this.clients);
          },
          error: (err) => {
            console.error('Error al cargar todos los clientes:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar clientes asignados:', err);
      }
    });
  }
  

  clientesFiltrados(): Client[] {
    if (!this.searchText) return this.clients;
    return this.clients.filter(client =>
      client.full_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  asignarClientesSeleccionados(): void {
    const sellerId = localStorage.getItem('user_id');
  
    if (!sellerId) {
      console.error('No se encontró el ID del vendedor.');
      return;
    }
  
    const seleccionados = this.clients
      .filter(client => client.selected)
      .map(client => ({
        id: client.id,
        name: client.full_name,
        address: client.address,
        phone: client.phone,
        notes: client.notes || ''
      }));
  
    if (seleccionados.length === 0) {
      console.error('No hay clientes seleccionados para asignar.');
      return;
    }

  
    this.assignedClientsService.postAssignedClients(sellerId, seleccionados)
      .subscribe({
        next: (response) => {
          console.log('Clientes asignados exitosamente:', response);
  
          // 🔥 Remover clientes asignados de la lista
          const asignadosIds = seleccionados.map(c => c.id);
          this.clients = this.clients.filter(c => !asignadosIds.includes(c.id));
        },
        error: (error) => {
          console.error('Error al asignar clientes:', error);
        }
      });
  }
  
  

  updateClients(): void {
    this.loadClients();
  }
}


