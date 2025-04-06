import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPage } from './register.page';
import { RegisterService } from 'src/app/services/register.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let alertController: AlertController;

  beforeEach(async () => {
    mockRegisterService = jasmine.createSpyObj('RegisterService', ['registerClient']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, RegisterPage], // Importa el componente directamente
      providers: [
        { provide: RegisterService, useValue: mockRegisterService },
        { provide: Router, useValue: mockRouter },
        AlertController
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not register if fields are missing', async () => {
    spyOn(alertController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    }) as any);

    await component.registrarse();

    expect(alertController.create).toHaveBeenCalled();
    expect(mockRegisterService.registerClient).not.toHaveBeenCalled();
  });

  it('should not register if passwords do not match', async () => {
    spyOn(alertController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    }) as any);

    component.full_name = 'John Doe';
    component.email = 'john@example.com';
    component.phone = '1234567890';
    component.address = '123 Street';
    component.password = 'password123';
    component.confirm_password = 'differentPassword';

    await component.registrarse();

    expect(alertController.create).toHaveBeenCalled();
    expect(mockRegisterService.registerClient).not.toHaveBeenCalled();
  });

  it('should register successfully', async () => {
    spyOn(alertController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    }) as any);

    component.full_name = 'John Doe';
    component.email = 'john@example.com';
    component.phone = '1234567890';
    component.address = '123 Street';
    component.password = 'password123';
    component.confirm_password = 'password123';

    mockRegisterService.registerClient.and.returnValue(of({}));

    await component.registrarse();

    expect(mockRegisterService.registerClient).toHaveBeenCalled();
    expect(alertController.create).toHaveBeenCalled();
    //expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show an error alert if registration fails', async () => {
    spyOn(alertController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    }) as any);

    component.full_name = 'John Doe';
    component.email = 'john@example.com';
    component.phone = '1234567890';
    component.address = '123 Street';
    component.password = 'password123';
    component.confirm_password = 'password123';

    mockRegisterService.registerClient.and.returnValue(throwError(() => new Error('Error de red')));

    await component.registrarse();

    expect(mockRegisterService.registerClient).toHaveBeenCalled();
    expect(alertController.create).toHaveBeenCalled();
  });
});

