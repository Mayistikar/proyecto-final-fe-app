import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  imports: [IonicModule]
})
export class TrackingComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map: any;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    // Load the Google Maps API
    this.loadGoogleMapsAPI();
  }

  private loadGoogleMapsAPI(): void {
    // Create a global callback function
    const callbackName = 'initGoogleMap';

    // Define the callback function that Google will call when API is loaded
    (window as any)[callbackName] = () => {
      this.ngZone.run(() => {
        // Initialize the map after the API is fully loaded
        this.initMap();
      });
    };

    // Create and append the script tag
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDI9dWJhEFkxoWnSRoGoo3DCorvMUx_Dgk&callback=${callbackName}`;
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
      const mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      };

      // Use window.google to ensure we're accessing the global object
      this.map = new (window as any).google.maps.Map(
        this.mapContainer.nativeElement,
        mapOptions
      );
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }
}
