import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home-client.page.html',
  standalone: true,
  imports: [CommonModule,FormsModule,IonicModule],
  styleUrls: ['./home-client.page.scss'],
})
export class HomePageClient {}