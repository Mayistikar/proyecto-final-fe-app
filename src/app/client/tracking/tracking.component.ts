import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  status: string;
}

interface Order {
  id: string;
  client_id: string;
  seller_id: string;
  state: string;
  total: number;
  deliver_date: string | null;
  created_at: string;
  items: OrderItem[];
}

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true
})
export class TrackingComponent implements AfterViewInit, OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  map: any;
  truckMarker: any;
  animationPath: any[] = [];
  animationIndex = 0;
  animationTimeout: any;
  orderId: string | null = null;
  order: Order | null = null;
  deliveryMessage: string | null = null;

  // Locations for warehouse and client (example coordinates)
  warehouseLocation = { lat: 4.7110, lng: -74.0721 }; // Bogotá, Colombia
  clientLocation = { lat: 4.7000, lng: -74.0800 };   // Bogotá, Colombia (más cerca de la bodega)

  constructor(private ngZone: NgZone, private http: HttpClient) {}

  ngOnInit() {
    // Get order_id from localStorage
    this.orderId = localStorage.getItem('order_id');
    console.log('Tracking order ID:', this.orderId);

    if (this.orderId) {
      this.fetchOrderDetails(this.orderId);
    } else {
      console.error('No order_id found in localStorage');
    }
  }

  private fetchOrderDetails(orderId: string) {
    const apiUrl = `https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/orders/${orderId}`;

    this.http.get<Order>(apiUrl).subscribe({
      next: (data) => {
        this.order = data;
        console.log('Order details loaded:', this.order);

        if (this.order.state === "OrderDelivered") {
          this.deliveryMessage = "¡Orden entregada con éxito!";
        }

        // If map is already initialized, update it based on order state
        if (this.map) {
          this.updateMapBasedOnOrderState();
        }
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
      }
    });
  }

  private updateOrderState(orderId: string, newState: string) {
    const apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/orders/update-state';

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const payload = {
      order_id: orderId,
      state: newState
    };

    this.http.post(apiUrl, payload, { headers }).subscribe({
      next: (response) => {
        console.log('Order state updated successfully:', response);

        // Update local order state and message
        if (this.order && newState === "OrderDelivered") {
          this.order.state = newState;
          this.deliveryMessage = "¡Orden entregada con éxito!";
        }
      },
      error: (error) => {
        console.error('Error updating order state:', error);
      }
    });
  }

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

      // Adjust bounds to show both markers
      const bounds = new (window as any).google.maps.LatLngBounds();
      bounds.extend(this.warehouseLocation);
      bounds.extend(this.clientLocation);
      this.map.fitBounds(bounds);

      // Handle map display based on order state
      this.updateMapBasedOnOrderState();
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  private updateMapBasedOnOrderState(): void {
    // If no order or map data yet, exit
    if (!this.order || !this.map) return;

    if (this.order.state === "OrderDelivered") {
      // For delivered orders, show truck at destination without animation
      this.createTruckMarker(this.clientLocation);
      this.displayRouteWithoutAnimation();
    } else {
      // For orders in progress, start the animation
      this.createTruckMarker(this.warehouseLocation);
      this.calculateAndDisplayRoute();
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

  private displayRouteWithoutAnimation(): void {
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
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    } catch (error) {
      console.error('Failed to calculate route:', error);
    }
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

      // Update order state to delivered when animation completes
      if (this.orderId) {
        // Using "OrderDelivered" as the logical next state after delivery
        this.updateOrderState(this.orderId, "OrderDelivered");
      }

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
