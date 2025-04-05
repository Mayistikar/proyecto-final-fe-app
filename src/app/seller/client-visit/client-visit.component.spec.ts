import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ClientVisitPage, VisitResult } from './client-visit.component';
import { ClientVisitService } from 'src/app/services/client-visit.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NavController } from '@ionic/angular';
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
        ClientVisitPage, // ✅ Importar el componente standalone
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: NavController, useValue: jasmine.createSpyObj('NavController', ['navigateForward']) },
        { provide: ClientVisitService, useValue: mockClientVisitService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientVisitPage);
    component = fixture.componentInstance;

    // Espiar alert()
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

  it('should register the visit and navigate on success', fakeAsync(() => {
    component.client_id = '1';
    component.seller_id = '2';
    component.visit_datetime = '2025-04-04T10:00:00Z';
    component.duration_minutes = 45;
    component.observations = 'Cliente interesado';
    component.result = VisitResult.INTERESTED;

    mockClientVisitService.registerClientVisit.and.returnValue(of({}));

    component.registerClientVisit();
    tick();

    expect(mockClientVisitService.registerClientVisit).toHaveBeenCalledWith(
      '1',
      '2',
      new Date('2025-04-04T10:00:00Z'),
      45,
      'Cliente interesado',
      VisitResult.INTERESTED
    );

    expect(window.alert).toHaveBeenCalledWith('Visita registrada exitosamente.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  }));
});





