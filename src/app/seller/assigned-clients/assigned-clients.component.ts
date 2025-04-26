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
  generalNote: string = '';
  generalNotesList: string[] = [];

  private updateClickCount = 0;       
  private updateClickTimerActive = false;

  constructor(private assignedClientsService: AssignedClientsService) {}

  ngOnInit(): void {
    this.chargeClients();
  }

  chargeClients(): void {
    this.assignedClientsService.getAssignedClients().subscribe({
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
    if (this.updateClickCount >= 3) {
      console.warn('¡Has alcanzado el límite de actualizaciones en 30 segundos!');
      return;
    }

    this.chargeClients();
    this.updateClickCount++;

    console.log(`Actualizaciones realizadas: ${this.updateClickCount}`);

    if (!this.updateClickTimerActive) {
      this.updateClickTimerActive = true;
      setTimeout(() => {
        this.updateClickCount = 0;
        this.updateClickTimerActive = false;
        console.log('Contador de actualizaciones reseteado.');
      }, 30000); // 30 segundos
    }
  }

  guardarNota() {
    if (this.generalNote.trim() === '') return;

    this.generalNotesList.push(this.generalNote); // Agregamos la nueva nota a la lista
    localStorage.setItem('notasGeneralesClientes', JSON.stringify(this.generalNotesList));
    this.generalNote = ''; 
    console.log('Notas guardadas:', this.generalNotesList);
  }

  loadNotes() {
    const savedNotes = localStorage.getItem('notasGeneralesClientes');
    if (savedNotes) {
      this.generalNotesList = JSON.parse(savedNotes);
    }
  }

  eliminarNotas() {
    localStorage.removeItem('notasGeneralesClientes');
    this.generalNotesList = [];
    console.log('Notas eliminadas.');
  }

  eliminarNota(index: number) {
    this.generalNotesList.splice(index, 1);
    this.guardarNotasEnLocalStorage();
  }
  guardarNotasEnLocalStorage() {
    localStorage.setItem('generalNotesList', JSON.stringify(this.generalNotesList));
  }
  
  
}

