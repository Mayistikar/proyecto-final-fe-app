import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginClientService } from './login-client.service';

describe('LoginClientService', () => {
  let service: LoginClientService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginClientService]
    });
    service = TestBed.inject(LoginClientService);
    httpMock = TestBed.inject(HttpTestingController);

    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store access_token, role, and user_id in localStorage', () => {
    const email = 'andres@example.com';
    const password = 'Test1234';
    const mockResponse = {
      access_token: 'fake-token-123',
      role: 'client',
      id: 'user-001'
    };

    service.loginClient(email, password).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, password });

    req.flush(mockResponse);

    expect(localStorage.getItem('access_token')).toBe('fake-token-123');
    expect(localStorage.getItem('role')).toBe('client');
    expect(localStorage.getItem('user_id')).toBe('user-001');
  });

  it('should return the user role from localStorage', () => {
    localStorage.setItem('role', 'client');
    expect(service.getUserRole()).toBe('client');
  });

  it('should return the user ID from localStorage', () => {
    localStorage.setItem('user_id', 'user-001');
    expect(service.getUserId()).toBe('user-001');
  });

  it('should return true if access_token exists in localStorage', () => {
    localStorage.setItem('access_token', 'token123');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false if access_token does not exist', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should remove token, role, and user_id on logout', () => {
    localStorage.setItem('access_token', 'token123');
    localStorage.setItem('role', 'admin');
    localStorage.setItem('user_id', 'user-001');

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull(); // Nota: tu código remueve 'token', no 'access_token'
    expect(localStorage.getItem('role')).toBeNull();
    expect(localStorage.getItem('user_id')).toBeNull();
  });

});

