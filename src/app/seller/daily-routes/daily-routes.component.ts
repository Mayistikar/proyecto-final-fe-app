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
  client_location_x: number;
  client_location_y: number;
}

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

  private directionsService: google.maps.DirectionsService | null = null;
  private directionsRenderer: google.maps.DirectionsRenderer | null = null;

  private markers = new Map<string, google.maps.Marker>();
  private infoWindows = new Map<string, google.maps.InfoWindow>();
  private currentInfoWindow: google.maps.InfoWindow | null = null;

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
        this.clients = data.clients; // Extrae los clientes de la respuesta
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

    google.maps.event.addListener(this.map, 'click', () => {
      if (this.currentInfoWindow) this.currentInfoWindow.close();
    });

    this.clients.forEach(client => {
      if (client.client_location_x && client.client_location_y) {
        const position = {
          lat: client.client_location_x,
          lng: client.client_location_y,
        };

        const marker = new google.maps.Marker({
          position: position,
          map: this.map,
          title: client.name,
          animation: google.maps.Animation.DROP
        });

        // Store marker reference
        this.markers.set(client.id, marker);

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

        // Store info window reference
        this.infoWindows.set(client.id, infoWindow);

        marker.addListener('click', () => {
          this.openInfoWindow(client.id);
        });

        bounds.extend(position);
      }
    });

    if (!bounds.isEmpty()) {
      this.map.fitBounds(bounds);
      this.displayRoute();
    }
  }

  public focusOnClient(clientId: string): void {
    const marker = this.markers.get(clientId);

    if (marker && this.map) {
      // Center the map on the marker
      this.map.setCenter(marker.getPosition()!);
      this.map.setZoom(15); // Zoom in closer

      // Open the info window
      this.openInfoWindow(clientId);

      // Add a bounce animation to highlight the marker
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1500);
    }
  }

  private openInfoWindow(clientId: string): void {
    const marker = this.markers.get(clientId);
    const infoWindow = this.infoWindows.get(clientId);

    if (marker && infoWindow && this.map) {
      // Close the currently open info window if there is one
      if (this.currentInfoWindow) {
        this.currentInfoWindow.close();
      }

      // Open the new info window
      infoWindow.open(this.map, marker);
      this.currentInfoWindow = infoWindow;
    }
  }

  private displayRoute(): void {
    if (!this.map || this.clients.length < 2) return;

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true, // Don't show default markers, we have our own
      polylineOptions: {
        strokeColor: '#007aff',
        strokeWeight: 5,
        strokeOpacity: 0.7
      }
    });

    // Extract locations from clients for waypoints
    const waypoints = this.clients
      .filter(client => client.client_location_x && client.client_location_y)
      .slice(1, -1)
      .map(client => {
        return {
          location: new google.maps.LatLng(
            client.client_location_x,
            client.client_location_y
          ),
          stopover: true
        };
      });

    const validClients = this.clients.filter(
      client => client.client_location_x && client.client_location_y
    );

    if (validClients.length < 1) return;

    const origin = new google.maps.LatLng(
      validClients[0].client_location_x,
      validClients[0].client_location_y
    );

    const destination = new google.maps.LatLng(
      validClients[validClients.length - 1].client_location_x,
      validClients[validClients.length - 1].client_location_y
    );

    this.directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer!.setDirections(response);

          // Calculate total distance and time
          const route = response!.routes[0];
          let totalDistance = 0;
          let totalDuration = 0;

          route.legs.forEach((leg) => {
            totalDistance += leg.distance?.value || 0;
            totalDuration += leg.duration?.value || 0;
          });

          console.log(`Route created: ${(totalDistance/1000).toFixed(1)}km, ${Math.round(totalDuration/60)} minutes`);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  }

}
