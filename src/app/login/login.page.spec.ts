import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginClientService } from '../services/login-client.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';


describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let loginClientServiceSpy: jasmine.SpyObj<LoginClientService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let mockAlert: any; // Simulación de una alerta de Ionic

  beforeEach(waitForAsync(() => {
    loginClientServiceSpy = jasmine.createSpyObj('LoginClientService', ['loginClient', 'getUserRole', 'getUserId']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    const mockStorage: Record<string, string> = {
      access_token: 'fake_token',
      role: 'seller',
      user_id: 'sellerId123'
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return mockStorage[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(localStorage, 'removeItem').and.callFake(() => {});

    // Simulación de un objeto de alerta de Ionic
    mockAlert = jasmine.createSpyObj('mockAlert', ['present', 'dismiss', 'onDidDismiss']);

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
        LoginPage
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            events: of({}), // Simula eventos de navegación
          }
        },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'mockValue' } } } },
        { provide: LoginClientService, useValue: loginClientServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ]
    }).compileComponents();



    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    // Configurar la simulación para que alertController.create() devuelva mockAlert
    alertControllerSpy.create.and.returnValue(Promise.resolve(mockAlert));
  }));

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar una alerta si los campos están vacíos', async () => {
    component.email = '';
    component.password = '';
    await component.login();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'Todos los campos son obligatorios.',
      buttons: ['Cerrar']
    });
    expect(mockAlert.present).toHaveBeenCalled();
  });

  // it('debería mostrar una alerta si las credenciales son incorrectas', async () => {
  //   loginClientServiceSpy.loginClient.and.returnValue(throwError(() => new Error('Credenciales incorrectas')));

  //   component.email = 'test@example.com';
  //   component.password = 'wrongpassword';
  //   await component.login();

  //   expect(alertControllerSpy.create).toHaveBeenCalledWith({
  //     header: 'Error',
  //     message: 'Credenciales incorrectas. Inténtalo nuevamente.',
  //     buttons: ['Cerrar']
  //   });
  //   expect(mockAlert.present).toHaveBeenCalled();
  // });





  it('debería llamar a loginClientService con las credenciales correctas', async () => {
    const testEmail = 'test@example.com';
    const testPassword = 'securePassword';
    loginClientServiceSpy.loginClient.and.returnValue(of(true));
    loginClientServiceSpy.getUserRole.and.returnValue('client');

    component.email = testEmail;
    component.password = testPassword;
    await component.login();

    expect(loginClientServiceSpy.loginClient).toHaveBeenCalledWith(testEmail, testPassword);
  });





})




































