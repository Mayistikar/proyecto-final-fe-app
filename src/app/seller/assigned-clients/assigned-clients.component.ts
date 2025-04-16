import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AssignedClientsService } from 'src/app/services/assigned-clients.service'; // Asegúrate que el path sea correcto

@Component({
  selector: 'app-assigned-clients',
  templateUrl: './assigned-clients.component.html',
  styleUrls: ['./assigned-clients.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AssignedClientsComponent implements OnInit {

  searchText: string = '';
  clients: any[] = [];

  constructor(private assignedClientsService: AssignedClientsService) {}

  ngOnInit(): void {
    this.chargeClients();
  }

  chargeClients(): void {
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

  clientesFiltrados() {
    if (!this.searchText) return this.clients;
    return this.clients.filter((c: any) =>
      c.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  clearSearch() {
    this.searchText = '';
  }

  actualizarLista() {
    console.log('Actualizar lista...');
  }
}

