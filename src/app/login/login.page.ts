import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginClientService } from '../services/login-client.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';
import { firstValueFrom } from 'rxjs';

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
  private spinner: any;

  constructor(
    private loginClientService: LoginClientService,
    private router: Router,
    private alertCtrl: AlertController,
    private translationService: TranslationService,
    private loadingController: LoadingController,
    private translateService: TranslateService // ✅ Se inyecta correctamente
  ) {}

  switchLanguage() {
    this.translationService.switchLanguage();
  }

  async login() {
    if (!this.email || !this.password) {
      const errorMsg = await firstValueFrom(this.translateService.get('login.fields_required'));
      const errorTitle = await firstValueFrom(this.translateService.get('login.title'));
      await this.showAlert(errorTitle, errorMsg);
      return;
    }

    const loadingMsg = await firstValueFrom(this.translateService.get('login.loading'));
    await this.presentSpinner(loadingMsg);

    this.loginClientService.loginClient(this.email, this.password).subscribe({
      next: async () => {
        await this.dismissSpinner();
        const successMsg = await firstValueFrom(this.translateService.get('login.success'));
        const successTitle = await firstValueFrom(this.translateService.get('login.title'));
        await this.showAlert(successTitle, successMsg);

        const role = this.loginClientService.getUserRole();
        this.loginClientService.setUserEmail(this.email);

        if (role === 'client') {
          this.router.navigate(['/home-client']);
        } else if (role === 'seller') {
          this.router.navigate(['/home']);
        } else {
          const unknownRole = await firstValueFrom(this.translateService.get('login.unknown_role'));
          await this.showAlert('Error', unknownRole);
        }
      },
      error: async (err) => {
        await this.dismissSpinner();
        const errorMsg = await firstValueFrom(this.translateService.get('login.invalid_credentials'));
        await this.showAlert('Error', errorMsg);
        console.error(err);
      }
    });
  }

  async showAlert(title: string, message: string) {
    const closeText = await firstValueFrom(this.translateService.get('login.close'));
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [closeText]
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
    }
  }
}
