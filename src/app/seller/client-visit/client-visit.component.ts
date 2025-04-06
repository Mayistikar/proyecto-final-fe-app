import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ClientVisitService } from 'src/app/services/client-visit.service';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';


export enum VisitResult {
  INTERESTED = 'interested',
  NOT_INTERESTED = 'not_interested',
  FOLLOW_UP = 'follow_up',
}

@Component({
  selector: 'app-client-visit',
  templateUrl: './client-visit.component.html',
  styleUrls: ['./client-visit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TranslatePipe,
    ReactiveFormsModule,
  ]
})
export class ClientVisitPage {

  clients: any[] = [];
  public VisitResult = VisitResult;
  public buttonState: { [key: string]: boolean } = {
    "interested": false,
    "not_interested": false,
    "follow_up": true
  };
  public isSubmitting: boolean = false;
  private spinner: any;

  clientVisitForm = new FormGroup({
    seller_id: new FormControl('', [Validators.required]),
    client_id: new FormControl('', [Validators.required, Validators.email]),
    visit_datetime: new FormControl(new Date().toISOString(), [Validators.required]),
    duration_minutes: new FormControl(0, [Validators.required, Validators.min(1)]),
    observations: new FormControl('', [Validators.required]),
    result: new FormControl(VisitResult.NOT_INTERESTED, [Validators.required])
  });


  constructor(
    private clientVisitService: ClientVisitService,
    private router: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public translateService: TranslateService) {
    const seller_id:string = localStorage.getItem('user_email') || '';
    this.clientVisitForm.get('seller_id')?.setValue(seller_id)
    this.loadClients();
  }

  loadClients() {
    this.clientVisitService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        console.log(this.clients);
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      },
    });
  }

  get seller_id() {
    return this.clientVisitForm.get('seller_id')!;
  }

  get client_id() {
    return this.clientVisitForm.get('client_id')!;
  }

  get visit_datetime() {
    return this.clientVisitForm.get('visit_datetime')!;
  }

  get duration_minutes() {
    return this.clientVisitForm.get('duration_minutes')!;
  }

  get observations() {
    return this.clientVisitForm.get('observations')!;
  }

  get result() {
    return this.clientVisitForm.get('result')!;
  }

  setResult(result: VisitResult) {
    this.clientVisitForm.get('result')?.setValue(result);
    this.buttonState = {
      interested: result === VisitResult.INTERESTED,
      not_interested: result === VisitResult.NOT_INTERESTED,
      follow_up: result === VisitResult.FOLLOW_UP
    };
  }

  async  onSubmit() {
    console.log('Submit button clicked');
    console.log(this.clientVisitForm.getRawValue());

    if (!this.clientVisitForm.valid) {
      console.warn('Form is invalid');
      console.table(this.clientVisitForm.value);
      return;
    }

    this.isSubmitting = true;

    const loadingMessage = await firstValueFrom(this.translateService.get('seller.clientVisit.syncingButton'));
    await this.presentSpinner(loadingMessage);

    const payload = this.clientVisitForm.getRawValue();
    this.clientVisitService.registerClientVisit(payload).subscribe({
      next: () => {
        this.translateService.get('seller.clientVisit.syncSuccess').subscribe(text => {
          this.presentToast(text, 'top');
        });
        this.isSubmitting = false;
        this.spinner.dismiss();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.translateService.get('seller.clientVisit.syncError').subscribe(text => {
          this.presentToast(text, 'top');
        });
        this.isSubmitting = false;
        this.spinner.dismiss();
        console.error(err);
      },
    });
  }

  async presentToast(message: string, position: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position || 'top',
    });

    await toast.present();
  }

  async presentSpinner(message: string) {
    this.spinner = await this.loadingController.create({
      message: message,
    });
    await  this.spinner.present();
  }

}
