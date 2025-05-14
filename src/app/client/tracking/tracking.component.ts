/// <reference types="google.maps" />

import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslatePipe } from "@ngx-translate/core";
import { Order } from "../../services/deliveries.service";

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslatePipe],
})
export class TrackingComponent implements AfterViewInit {
  private map: any;
  orderId: string | null = null;
  order: Order | null = null;

  constructor() {
    this.orderId = localStorage.getItem('order_id');
    if (this.orderId) {
      fetch(`https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/orders/${this.orderId}`)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.order = await response.json();
          console.log('Order details:', this.order);
        })
        .then((data) => {
          console.log('Order details:', data);
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  async initMap(): Promise<void> {
    const warehousePosition = { lat: 4.711, lng: -74.072 };
    const deliveryPosition = { lat: 4.6695391, lng: -74.1173893 };

    try {
      //@ts-ignore
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;
      const { Marker } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      this.map = new Map(
        document.getElementById('map') as HTMLElement,
        {
          zoom: 12,
          center: warehousePosition, // Center the map on the warehouse
          mapId: 'DEMO_MAP_ID',
        }
      );

      // Add markers with names
      new Marker({
        position: warehousePosition,
        map: this.map,
        title: 'Bodega', // Name for the warehouse
      });

      new Marker({
        position: deliveryPosition,
        map: this.map,
        title: 'Entrega', // Name for the delivery
      });

      // Initialize the DirectionsService and DirectionsRenderer
      const directionsService = new DirectionsService();
      const directionsRenderer = new DirectionsRenderer({ map: this.map });

      // Request a route between the two points
      const request = {
        origin: warehousePosition,
        destination: deliveryPosition,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);

          // Simulate the truck moving along the route
          const route = result.routes[0].overview_path;
          const interpolatedRoute: google.maps.LatLng[] = [];

          // Interpolate points to make the movement smoother
          for (let i = 0; i < route.length - 1; i++) {
            const start = route[i];
            const end = route[i + 1];
            const steps = 10; // Number of interpolated points between two route points

            for (let j = 0; j <= steps; j++) {
              const lat = start.lat() + (end.lat() - start.lat()) * (j / steps);
              const lng = start.lng() + (end.lng() - start.lng()) * (j / steps);
              interpolatedRoute.push(new google.maps.LatLng(lat, lng));
            }
          }

          let step = 0;

          const truckMarker = new Marker({
            position: route[0],
            map: this.map,
            title: '🚛', // Truck icon
            label: '🚛', // Display the truck emoji
          });

          const interval = setInterval(() => {
            step++;
            if (step >= interpolatedRoute.length) {
              clearInterval(interval); // Stop the animation when the truck reaches the destination

              // Make a request to the delivered endpoint
              fetch('http://localhost:3000/delivered', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'delivered' }),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then((data) => {
                  console.log('Delivery status updated:', data);
                })
                .catch((error) => {
                  console.error('Error making request:', error);
                });
            } else {
              truckMarker.setPosition(interpolatedRoute[step]);
            }
          }, 500);

        } else {
          console.error('Error fetching directions:', status);
        }
      });

    } catch (error) {
      console.error('Error loading Google Maps libraries:', error);
    }
  }

}
