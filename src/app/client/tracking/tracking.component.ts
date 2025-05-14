import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  imports: [IonicModule],
  standalone: true
})
export class TrackingComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map: any;
  truckMarker: any;
  animationPath: any[] = [];
  animationIndex = 0;
  animationTimeout: any;

  // Locations for warehouse and client (example coordinates)
  warehouseLocation = { lat: 4.7110, lng: -74.0721 }; // Bogotá, Colombia
  clientLocation = { lat: 4.7000, lng: -74.0800 };   // Bogotá, Colombia (más cerca de la bodega)

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.loadGoogleMapsAPI();
  }

  private loadGoogleMapsAPI(): void {
    const callbackName = 'initGoogleMap';

    (window as any)[callbackName] = () => {
      this.ngZone.run(() => {
        this.initMap();
      });
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDI9dWJhEFkxoWnSRoGoo3DCorvMUx_Dgk&libraries=geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  private initMap(): void {
    if (!this.mapContainer) {
      console.error('Map container not found');
      return;
    }

    try {
      // Create the map
      this.map = new (window as any).google.maps.Map(
        this.mapContainer.nativeElement,
        {
          zoom: 13,
          center: this.warehouseLocation
        }
      );

      // Create warehouse marker
      const warehouseMarker = new (window as any).google.maps.Marker({
        position: this.warehouseLocation,
        map: this.map,
        title: 'Bodega',
        label: 'B'
      });

      // Create client marker
      const clientMarker = new (window as any).google.maps.Marker({
        position: this.clientLocation,
        map: this.map,
        title: 'Cliente',
        label: 'C'
      });

      // Create truck marker at warehouse initially
      this.createTruckMarker(this.warehouseLocation);

      // Adjust bounds to show both markers
      const bounds = new (window as any).google.maps.LatLngBounds();
      bounds.extend(this.warehouseLocation);
      bounds.extend(this.clientLocation);
      this.map.fitBounds(bounds);

      // Draw route and start animation
      this.calculateAndDisplayRoute();
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  private createTruckMarker(position: any): void {
    // Create truck emoji marker
    this.truckMarker = new (window as any).google.maps.Marker({
      position: position,
      map: this.map,
      title: 'Delivery Truck',
      label: {
        text: '🚚',
        fontSize: '20px'
      },
      // Remove standard marker icon to only show the emoji
      icon: {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 0
      }
    });
  }

  private calculateAndDisplayRoute(): void {
    try {
      const directionsService = new (window as any).google.maps.DirectionsService();
      const directionsRenderer = new (window as any).google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true // Keep our custom markers
      });

      directionsService.route(
        {
          origin: this.warehouseLocation,
          destination: this.clientLocation,
          travelMode: (window as any).google.maps.TravelMode.DRIVING
        },
        (response: any, status: any) => {
          if (status === (window as any).google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);

            // Start the truck animation along the route
            this.animateDelivery(response);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    } catch (error) {
      console.error('Failed to calculate route:', error);
    }
  }

  private animateDelivery(directionsResult: any): void {
    // Extract the route path points
    const route = directionsResult.routes[0].overview_path;
    this.animationPath = route;
    this.animationIndex = 0;

    // Start animation
    this.animateStep();
  }

  private animateStep(): void {
    // Check if animation is complete
    if (this.animationIndex >= this.animationPath.length) {
      console.log('Delivery completed');
      return;
    }

    // Move truck to next position
    const position = this.animationPath[this.animationIndex];
    this.truckMarker.setPosition(position);

    // Move to next point after delay
    this.animationIndex++;
    this.animationTimeout = setTimeout(() => {
      this.animateStep();
    }, 300); // Animation speed (milliseconds between steps)
  }

  ngOnDestroy(): void {
    // Clean up animation when component is destroyed
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }
}
