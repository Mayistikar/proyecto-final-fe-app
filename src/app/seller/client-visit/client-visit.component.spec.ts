import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientVisitPage, VisitResult } from './client-visit.component';
import { ClientVisitService } from 'src/app/services/client-visit.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

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
        ClientVisitPage, // ✅ Importar el componente standalone
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigateForward']) },
        { provide: ClientVisitService, useValue: mockClientVisitService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientVisitPage);
    component = fixture.componentInstance;

    // Espiar alert() y console.error()
    spyOn(window, 'alert');
    spyOn(console, 'error');

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

  it('should register a visit successfully', () => {
    // Set valid data
    component.client_id = 'client123';
    component.seller_id = 'seller123';
    component.visit_datetime = new Date().toISOString();
    component.duration_minutes = 30;
    component.observations = 'Test observation';
    component.result = VisitResult.INTERESTED;

    const visitDate = new Date(component.visit_datetime);
    mockClientVisitService.registerClientVisit.and.returnValue(of(null));

    component.registerClientVisit();

    expect(mockClientVisitService.registerClientVisit).toHaveBeenCalledWith(
      'client123',
      'seller123',
      visitDate,
      30,
      'Test observation',
      VisitResult.INTERESTED
    );
    expect(window.alert).toHaveBeenCalledWith('Visita registrada exitosamente.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should alert error on registration failure', () => {
    // Set valid data
    component.client_id = 'client123';
    component.seller_id = 'seller123';
    component.visit_datetime = new Date().toISOString();
    component.duration_minutes = 45;
    component.observations = 'Error test observation';
    component.result = VisitResult.FOLLOW_UP;

    const visitDate = new Date(component.visit_datetime);
    const testError = new Error('Test error');
    mockClientVisitService.registerClientVisit.and.returnValue(throwError(testError));

    component.registerClientVisit();

    expect(mockClientVisitService.registerClientVisit).toHaveBeenCalledWith(
      'client123',
      'seller123',
      visitDate,
      45,
      'Error test observation',
      VisitResult.FOLLOW_UP
    );
    expect(window.alert).toHaveBeenCalledWith('Hubo un problema al registrar la visita. Inténtalo nuevamente.');
    expect(console.error).toHaveBeenCalledWith(testError);
  });
});
