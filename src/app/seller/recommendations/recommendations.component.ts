import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import {NgForOf, NgIf} from "@angular/common";

interface Client {
  id: string;
  name: string;
}

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, TranslatePipe, NgForOf, NgIf],
})
export class RecommendationsComponent implements OnInit {
  user_id: string | null = null;
  clients: Client[] = [];
  selectedClientId: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  recommendationResponse: any = null;

  constructor(private http: HttpClient) {
    this.user_id = <string>localStorage.getItem('user_id');
  }

  ngOnInit(): void {
    this.fetchClients();
  }

  private fetchClients(): void {
    console.log({ user_id: this.user_id });
    const apiUrl = `https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/sellers/${this.user_id}/clients`;

    this.http.get<{ clients: Client[] }>(apiUrl).subscribe({
      next: (data) => {
        this.clients = data.clients;
      },
      error: (err) => {
        console.error('Error fetching clients:', err);
        this.errorMessage = 'Failed to load clients. Please try again later.';
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadVideo(): void {
    if (!this.selectedClientId || !this.selectedFile) {
      this.errorMessage = 'Please select a client and a video file.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formData = new FormData();
    formData.append('seller_id', this.user_id!);
    formData.append('client_id', this.selectedClientId);
    formData.append('file', this.selectedFile);

    const apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/recommendations';

    this.http.post(apiUrl, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.recommendationResponse = response; // Guardar la respuesta del servidor
        alert('Video uploaded successfully!');
      },
      error: (err) => {
        console.error('Error uploading video:', err);
        this.errorMessage = 'Failed to upload video. Please try again later.';
        this.isLoading = false;
      },
    });
  }
}
