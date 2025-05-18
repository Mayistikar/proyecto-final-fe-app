import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  client_x_location: number;
  client_y_location: number;
}

const randomClients: Client[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '555-1234',
    address: '123 Main St',
    notes: 'VIP client',
    client_x_location: 4.610,
    client_y_location: -74.081
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '555-5678',
    address: '456 Elm St',
    notes: 'Prefers morning visits',
    client_x_location: 4.612,
    client_y_location: -74.083
  },
  {
    id: '3',
    name: 'Carol Lee',
    email: 'carol@example.com',
    phone: '555-9012',
    address: '789 Oak St',
    notes: '',
    client_x_location: 4.614,
    client_y_location: -74.080
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '555-3456',
    address: '321 Pine St',
    notes: 'New client',
    client_x_location: 4.609,
    client_y_location: -74.079
  },
  {
    id: '5',
    name: 'Eva Green',
    email: 'eva@example.com',
    phone: '555-7890',
    address: '654 Maple St',
    notes: 'Requires special attention',
    client_x_location: 4.611,
    client_y_location: -74.082
  }
];
interface Visit {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-daily-routes',
  templateUrl: './daily-routes.component.html',
  styleUrls: ['./daily-routes.component.scss'],
  imports: [
    TranslatePipe,
    IonicModule,
    FormsModule,
    NgForOf,
    NgIf
  ]
})
export class DailyRoutesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: google.maps.Map;
  private animationTimeout: any;
  private user_id: string | null = null;

  clients: Client[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.user_id = <string>localStorage.getItem('user_id');
  }

  ngOnInit(): void {
    this.fetchClients();
  }

  ngAfterViewInit() {
    this.loadGoogleMaps();
  }

  ngOnDestroy() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  private loadGoogleMaps() {
    const callback = 'initMapCallback';
    (window as any)[callback] = () => this.ngZone.run(() => this.initMap());

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDI9dWJhEFkxoWnSRoGoo3DCorvMUx_Dgk&callback=${callback}`;
    script.async = true;
    document.head.appendChild(script);
  }

  private initMap() {
    // Verifica que el contenedor del mapa esté disponible
    if (!this.mapContainer || !this.mapContainer.nativeElement.offsetHeight) {
      setTimeout(() => this.initMap(), 100); // Reintenta después de un breve retraso
      return;
    }

    // Inicializa el mapa
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 4.6109, lng: -74.0817 },
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Add markers if clients are loaded
    if (this.clients.length > 0) {
      this.addClientMarkers();
    }

    // Asegúrate de que el mapa se redimensione correctamente
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 500);
  }

  private fetchClients(): void {
    const apiUrl =
      `https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/sellers/${this.user_id}/clients`;

    this.http.get<{ seller_id: string; clients: Client[]; message: string }>(apiUrl).subscribe({
      next: async (data) => {
        // this.clients = data.clients; // Extrae los clientes de la respuesta
        this.clients = randomClients; // Usa datos de ejemplo para pruebas
        this.isLoading = false;

        // Inicializa el mapa después de cargar los clientes
        this.initMap();
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
        this.errorMessage = 'Failed to load clients. Please try again later.';
        this.isLoading = false;
      },
    });
  }

  private addClientMarkers(): void {
    if (!this.map || this.clients.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    let currentInfoWindow: google.maps.InfoWindow | null = null;

    google.maps.event.addListener(this.map, 'click', () => {
      if (currentInfoWindow) currentInfoWindow.close();
    });

    this.clients.forEach(client => {
      if (client.client_x_location && client.client_y_location) {
        const position = {
          lat: client.client_x_location,
          lng: client.client_y_location
        };

        const marker = new google.maps.Marker({
          position: position,
          map: this.map,
          title: client.name,
          animation: google.maps.Animation.DROP
        });

        const infoContent = `
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin-top: 0; color: #007aff;">${client.name}</h3>
          <p style="margin: 5px 0;  color: #007aff;"><strong>Dirección:</strong> ${client.address}</p>
          <p style="margin: 5px 0;  color: #007aff;"><strong>Teléfono:</strong> ${client.phone}</p>
        </div>
      `;

        const infoWindow = new google.maps.InfoWindow({
          content: infoContent,
          maxWidth: 250
        });

        // Add click listener with proper handling
        marker.addListener('click', () => {
          // Close currently open info window if exists
          if (currentInfoWindow) currentInfoWindow.close();

          // Open this info window
          infoWindow.open(this.map, marker);
          currentInfoWindow = infoWindow;
        });

        // Extend bounds to include this marker
        bounds.extend(position);
      }
    });

    // Adjust map to show all markers
    if (!bounds.isEmpty()) {
      this.map.fitBounds(bounds);
    }
  }

}
