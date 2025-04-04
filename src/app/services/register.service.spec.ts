import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService]
    });

    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to register a client', () => {
    const mockRequest = {
      full_name: 'Andrés Peláez',
      email: 'andres@example.com',
      phone: '3001234567',
      password: 'Test1234',
      confirm_password: 'Test1234',
      address: 'Calle Falsa 123'
    };

    const mockResponse = {
      message: 'Cliente registrado con éxito',
      success: true
    };

    service.registerClient(
      mockRequest.full_name,
      mockRequest.email,
      mockRequest.phone,
      mockRequest.password,
      mockRequest.confirm_password,
      mockRequest.address
    ).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/auth/client`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});

