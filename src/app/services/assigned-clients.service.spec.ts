import { AssignedClientsService } from "./assigned-clients.service";
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('AssignedClientsService', () => {
  let service: AssignedClientsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssignedClientsService]
    });
    service = TestBed.inject(AssignedClientsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all assigned clients', () => {
    const dummyClients = [
      { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789' },
      { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321' },
    ];

    service.getClients().subscribe((clients) => { // <- paréntesis aquí
      expect(clients).toEqual(dummyClients);
      expect(clients.length).toBe(2);
    });

    const req = httpMock.expectOne('https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/clients');
    expect(req.request.method).toBe('GET');
    req.flush(dummyClients);
  });

  it('should handle error when the request fails', () => {
    const errorMessage = 'Error al obtener clientes';
  
    service.getClients().subscribe(
      () => fail('Expected an error, but got clients'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne('https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/clients');
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should get assigned clients for the seller', () => {
    const dummyAssignedClients = [
      { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789' },
      { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321' },
    ];
  
    // Simulamos un sellerId en el localStorage
    localStorage.setItem('user_id', '123');
  
    service.getAssignedClients().subscribe((clients) => {
      expect(clients).toEqual(dummyAssignedClients);
      expect(clients.length).toBe(2);
    });
  
    const req = httpMock.expectOne('https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/sellers/123/clients');
    expect(req.request.method).toBe('GET');
    req.flush({ sellerId: '123', clients: dummyAssignedClients, message: 'Success' });
  });
  
  it('should handle error if sellerId is not found in localStorage', () => {
    // Simulamos que no existe el sellerId en localStorage
    localStorage.removeItem('user_id');
  
    service.getAssignedClients().subscribe(
      () => fail('Expected an error, but got clients'),
      (error) => {
        expect(error).toEqual(new Error('No sellerId available'));
      }
    );
  });

  it('should post assigned clients successfully', () => {
    const sellerId = '123';
    const dummyClients = [
      { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789' },
      { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321' },
    ];
  
    const response = { success: true, message: 'Clients assigned successfully', data: dummyClients };
  
    service.postAssignedClients(sellerId, dummyClients).subscribe((result) => {
      expect(result.success).toBe(true);
      expect(result.message).toBe('Clients assigned successfully');
    });
  
    const req = httpMock.expectOne('https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/sellers/clients');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      sellerId: sellerId,
      clients: [
        { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789', notes: '' },
        { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321', notes: '' },
      ],
    });
    req.flush(response);
  });
  
  it('should handle error when posting assigned clients fails', () => {
    const sellerId = '123';
    const dummyClients = [
      { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789' },
      { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321' },
    ];
  
    const errorMessage = 'Error al asignar clientes';
  
    service.postAssignedClients(sellerId, dummyClients).subscribe(
      () => fail('Expected an error, but got a response'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne('https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api/sellers/clients');
    expect(req.request.method).toBe('POST');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
  
  
  
});













