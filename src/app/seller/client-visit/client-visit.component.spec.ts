import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientVisitPage } from './client-visit.component';
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
    mockClientVisitService = jasmine.createSpyObj('ClientVisitService', ['registerClientVisit', 'getClients']);
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
        { provide: Router, useValue: mockRouter },
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
    // When calling setResult, form value and button state should update
    component.setResult(component.VisitResult.INTERESTED);
    expect(component.clientVisitForm.get('result')?.value).toBe(component.VisitResult.INTERESTED);
    expect(component.buttonState).toEqual({
      interested: true,
      not_interested: false,
      follow_up: false
    });
  });

  it('should not submit form if invalid', async () => {
    // Arrange: set an invalid form values
    component.clientVisitForm.patchValue({
      seller_id: '',
      client_id: '',
      visit_datetime: '',
      duration_minutes: null,
      observations: '',
      result: null
    });
    // Act
    await component.onSubmit();
    // Assert: submission is not processed and isSubmitting remains false
    expect(component.isSubmitting).toBe(false);
    expect(mockClientVisitService.registerClientVisit).not.toHaveBeenCalled();
  });


  it('should load clients successfully', () => {
    // Arrange
    const clientsMock = [{ id: 1, name: 'Client A' }];
    mockClientVisitService.getClients.and.returnValue(of(clientsMock));

    // Act
    component.loadClients();

    // Assert
    expect(component.clients).toEqual(clientsMock);
  });

  it('should log error when loadClients fails', () => {
    // Arrange
    const testError = new Error('Load error');
    mockClientVisitService.getClients.and.returnValue(throwError(testError));

    // Act
    component.loadClients();

    // Assert
    expect(console.error).toHaveBeenCalledWith('Error al cargar clientes:', testError);
  });
});
