import { Component, OnInit } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';


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
export class AssignedClientsComponent   {

  searchText: string = '';

  clientes = [
    { nombre: 'Juan Perez', direccion: 'Av. Principal 123', telefono: '123-456-789' },
    { nombre: 'María Rodriguez', direccion: 'Calle secundaria 545', telefono: '945-564-524' },
    { nombre: 'María Rodriguez', direccion: 'Calle secundaria 545', telefono: '945-564-524' },
    { nombre: 'María Rodriguez', direccion: 'Calle secundaria 545', telefono: '945-564-524' },
  ];

  clientesFiltrados() {
    if (!this.searchText) return this.clientes;
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  clearSearch() {
    this.searchText = '';
  }

  actualizarLista() {
    console.log('Actualizar lista...');
    // Aquí iría tu lógica real para recargar datos
  }
}
