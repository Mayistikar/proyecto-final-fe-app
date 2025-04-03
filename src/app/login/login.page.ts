import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginClientService } from '../services/login-client.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule,RouterModule]
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(private loginClientService: LoginClientService, private router: Router,private alertCtrl: AlertController) {}

  async login() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    console.log('Email:', this.email);
    console.log('Password:', this.password);

    this.loginClientService.loginClient(this.email, this.password).subscribe({
      next: async () => {
        await this.showAlert('Éxito', 'Inicio de sesión exitoso.');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.showAlert('Error', 'Credenciales incorrectas. Inténtalo nuevamente.');
        console.error(err);
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


}


