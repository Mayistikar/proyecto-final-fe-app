import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientVisitPage, VisitResult } from './client-visit.component';
import { ClientVisitService } from 'src/app/services/client-visit.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ClientVisitPage', () => {
  let component: ClientVisitPage;
  let fixture: ComponentFixture<ClientVisitPage>;
  let mockClientVisitService: jasmine.SpyObj<ClientVisitService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockClientVisitService = jasmine.createSpyObj('ClientVisitService', ['registerClientVisit']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigateForward']) },
        { provide: ClientVisitService, useValue: mockClientVisitService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientVisitPage);
    component = fixture.componentInstance;

    // Espiar alert() en lugar de AlertController
    spyOn(window, 'alert');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set visit result correctly', () => {
    component.setResult(VisitResult.INTERESTED);
    expect(component.result).toBe(VisitResult.INTERESTED);
  });

  it('should not register a visit if fields are missing', () => {
    component.client_id = '';
    component.seller_id = '';
    component.visit_datetime = '';
    component.duration_minutes = 0;
    component.observations = '';
    component.result = null as any;

    component.registerClientVisit();

    expect(window.alert).toHaveBeenCalledWith('Todos los campos son obligatorios.');
    expect(mockClientVisitService.registerClientVisit).not.toHaveBeenCalled();
  });



});




