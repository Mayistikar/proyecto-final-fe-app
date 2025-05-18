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

  selectedDate: string = new Date().toISOString();

  visits: Visit[] = [];

  private map!: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private polyline!: google.maps.Polyline;
  private animationMarker!: google.maps.Marker;
  private animationPath: google.maps.LatLngLiteral[] = [];
  private animationIndex = 0;
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

  private addClientMarker(location: google.maps.LatLngLiteral, clientName: string): void {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: clientName,
      label: clientName[0], // Usa la primera letra del nombre del cliente como etiqueta
    });
    this.markers.push(marker);
  }

}
