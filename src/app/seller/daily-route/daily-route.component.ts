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

declare const google: any; // necesario si estás usando el script clásico

@Component({
  selector: 'app-daily-route',
  standalone: true,
  templateUrl: './daily-route.component.html',
  styleUrls: ['./daily-route.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DailyRouteComponent implements OnInit, AfterViewInit {
  @ViewChild('googleMap', { static: true }) mapElementRef!: ElementRef;
  map!: google.maps.Map;

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
    // Inicializa el mapa aunque no haya clientes
    this.initGoogleMap([]);
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
    this.initGoogleMap(this.filteredClients);
  }

  initGoogleMap(clients: any[]): void {
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps API no está cargada');
      return;
    }

    const center = clients.length > 0
      ? { lat: clients[0].latitude, lng: clients[0].longitude }
      : { lat: 4.65, lng: -74.05 }; // Centro por defecto (Bogotá)

    this.map = new google.maps.Map(this.mapElementRef.nativeElement, {
      center,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    const bounds = new google.maps.LatLngBounds();

    clients.forEach(client => {
      const position = {
        lat: client.latitude,
        lng: client.longitude
      };
      bounds.extend(position);
      new google.maps.Marker({
        position,
        map: this.map,
        title: client.full_name
      });
    });

    if (clients.length > 1) {
      this.map.fitBounds(bounds);
    }

    this.loadingMap = false;
  }

  reorderClients(): void {
    this.filteredClients.reverse();
    this.initGoogleMap(this.filteredClients);
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
