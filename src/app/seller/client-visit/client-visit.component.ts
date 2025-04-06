import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { ClientVisitService } from 'src/app/services/client-visit.service';
import { TranslatePipe } from "@ngx-translate/core";
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

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
    ReactiveFormsModule
  ]
})
export class ClientVisitPage {

  private clients: any[] = [];
  public VisitResult = VisitResult;
  public buttonState: { [key: string]: boolean } = {
    "interested": false,
    "not_interested": false,
    "follow_up": false
  };
  public isSubmitting: boolean = false;

  constructor(private clientVisitService: ClientVisitService, private router: Router) {
    const seller_id:string = localStorage.getItem('seller_id') || '';
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

  clientVisitForm = new FormGroup({
    seller_id: new FormControl('', [Validators.required]),
    client_id: new FormControl('', [Validators.required]),
    visit_datetime: new FormControl(new Date().toISOString(), [Validators.required]),
    duration_minutes: new FormControl(0, [Validators.required, Validators.min(1)]),
    observations: new FormControl('', [Validators.required]),
    result: new FormControl(VisitResult.NOT_INTERESTED, [Validators.required])
  });

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

  onSubmit() {
    console.log('Submit button clicked');
    console.log(this.clientVisitForm.getRawValue());

    if (!this.clientVisitForm.valid) {
      console.warn('Form is invalid');
      console.table(this.clientVisitForm.value);
      return;
    }

    this.isSubmitting = true;

    const payload = this.clientVisitForm.getRawValue();

    this.clientVisitService.registerClientVisit(payload).subscribe({
      next: () => {
        alert('Visita registrada exitosamente.');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert('Hubo un problema al registrar la visita. Inténtalo nuevamente.');
        console.error(err);
      },
    });
  }

}
