import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DailyRouteService } from 'src/app/services/daily-route.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-daily-route',
  standalone: true,
  templateUrl: './daily-route.component.html',
  styleUrls: ['./daily-route.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DailyRouteComponent implements OnInit, AfterViewInit {
  @ViewChild('leafletMap', { static: false }) mapElementRef!: ElementRef;
  map!: L.Map;

  selectedDate: string = new Date().toISOString();
  minDate: string = new Date().toISOString();
  locale: string = 'en-US';
  departureTime: string = new Date().toISOString();

  assignedClients: any[] = [];
  filteredClients: any[] = [];
  loadingMap: boolean = true;

  constructor(
    private translate: TranslateService,
    private routeService: DailyRouteService
  ) {
    const currentLang = this.translate.currentLang || this.translate.getDefaultLang();
    this.locale = currentLang === 'es' ? 'es-CO' : 'en-US';
  }

  ngOnInit(): void {
    this.loadRouteData();
  }

  ngAfterViewInit(): void {
    // Se inicializa al filtrar
  }

  loadRouteData(): void {
    const sellerId = localStorage.getItem('sellerId');
    const sellerEmail = localStorage.getItem('sellerEmail');
    const dateOnly = new Date(this.selectedDate).toISOString().split('T')[0];

    if (!sellerId || !sellerEmail) {
      console.error('Faltan sellerId o sellerEmail en localStorage');
      this.loadingMap = false;
      return;
    }

    this.loadingMap = true;

    this.routeService.getClientsBySellerId(sellerId).subscribe({
      next: (response) => {
        this.assignedClients = Array.isArray(response.clients) ? response.clients : [];
        this.filterByDate();
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        this.assignedClients = [];
        this.filteredClients = [];
        this.loadingMap = false;
      }
    });

    this.routeService.getVisitsBySellerAndDate(sellerEmail, dateOnly).subscribe({
      next: (visits) => {
        if (Array.isArray(visits) && visits.length > 0) {
          this.departureTime = visits[0].created_at || new Date().toISOString();
        }
      },
      error: (err) => {
        console.error('Error al obtener visitas:', err);
      }
    });
  }

  filterByDate(): void {
    const selected = new Date(this.selectedDate).toDateString();
    this.filteredClients = this.assignedClients.filter(
      (client) => new Date(client.visit_date).toDateString() === selected
    );
    this.initLeafletMap(this.filteredClients);
  }

  initLeafletMap(clients: any[]): void {
    if (!this.map) {
      this.map = L.map(this.mapElementRef.nativeElement).setView([4.65, -74.05], 13); // Bogotá por defecto
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    } else {
      this.map.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
          this.map.removeLayer(layer);
        }
      });
    }

    const bounds: L.LatLngBounds = L.latLngBounds([]);

    clients.forEach(client => {
      const position = L.latLng(client.latitude, client.longitude);
      L.marker(position)
        .addTo(this.map)
        .bindPopup(client.full_name)
        .openPopup();
      bounds.extend(position);
    });

    if (clients.length > 1) {
      this.map.fitBounds(bounds);
    } else if (clients.length === 1) {
      this.map.setView(bounds.getCenter(), 15);
    }

    this.loadingMap = false;
  }

  reorderClients(): void {
    this.filteredClients.reverse();
    this.initLeafletMap(this.filteredClients);
  }

  getFormattedDepartureTime(): string {
    return new Date(this.departureTime).toLocaleTimeString(this.locale, {
      timeZone: 'America/Bogota',
      hour: '2-digit',
      minute: '2-digit',
      hour12: this.locale === 'es-CO'
    });
  }

  onDateSelected(): void {
    this.loadRouteData();
  }
}
