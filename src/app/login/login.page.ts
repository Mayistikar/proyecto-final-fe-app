import { Component } from '@angular/core';
import { IonicModule, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginClientService } from '../services/login-client.service';
import { AlertController } from '@ionic/angular';
import { TranslatePipe } from "@ngx-translate/core";
import { TranslationService } from "../services/translation.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, TranslatePipe]
})
export class LoginPage {

  email: string = '';
  password: string = '';
  private spinner: HTMLIonLoadingElement | null = null;

  constructor(
    private loginClientService: LoginClientService,
    private router: Router,
    private alertCtrl: AlertController,
    private translationService: TranslationService,
    private loadingController: LoadingController
  ) {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }

  async login() {
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    await this.presentSpinner('Iniciando sesión...');

    this.loginClientService.loginClient(this.email, this.password).subscribe({
      next: async () => {
        await this.dismissSpinner();
        await this.showAlert('Éxito', 'Inicio de sesión exitoso.');

        const role = this.loginClientService.getUserRole();
        const sellerId = this.loginClientService.getUserId();
        this.loginClientService.setUserEmail(this.email);

        localStorage.setItem('role', role);
        localStorage.setItem('userEmail', this.email);

        if (role === 'seller') {
          localStorage.setItem('sellerId', sellerId);
          localStorage.setItem('sellerEmail', this.email);
          this.router.navigate(['/home']);
        } else if (role === 'client') {
          localStorage.setItem('clientId', sellerId);
          this.router.navigate(['/home-client']);
        } else {
          await this.showAlert('Error', 'Rol no reconocido.');
        }
      },
      error: async () => {
        await this.dismissSpinner();
        await this.showAlert('Error', 'Credenciales incorrectas. Inténtalo nuevamente.');
      }
    });
  }

  async showAlert(title: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  async presentSpinner(message: string) {
    this.spinner = await this.loadingController.create({
      message: message
    });
    await this.spinner.present();
  }

  async dismissSpinner() {
    if (this.spinner) {
      await this.spinner.dismiss();
      this.spinner = null;
    }
  }
}