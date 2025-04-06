import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-home',
  templateUrl: './home-client.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterLinkActive, TranslatePipe, RouterLink],
  styleUrls: ['./home-client.page.scss'],
})
export class HomePageClient {}
