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
    this.assignedClientsService.getAssinedClients().subscribe({
      next: (data: any[]) => {
        this.clients = data;
        console.log('Clientes cargados:', this.clients);
      },
      error: (err: any) => {
        console.error('Error al cargar clientes:', err);
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
    const seleccionados = this.clients.filter(c => c.selected);
    console.log('Clientes seleccionados para asignar:', seleccionados);
    // Aquí puedes llamar al servicio para guardar la asignación
  }

  updateClients(): void {
    this.loadClients();
  }
}


