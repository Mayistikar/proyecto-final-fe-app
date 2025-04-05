import { TestBed } from '@angular/core/testing';
import { ClientVisitService } from './client-visit.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ClientVisitService', () => {
  let service: ClientVisitService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientVisitService]
    });

    service = TestBed.inject(ClientVisitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  it('should handle error when registering a visit', () => {
    const mockData = {
      client_id: '123',
      seller_id: '456',
      visit_datetime: new Date('2025-04-04T10:00:00Z'),
      duration_minutes: 30,
      observations: 'Observaciones',
      result: 'Seguimiento'
    };

    service.registerClientVisit(
      mockData.client_id,
      mockData.seller_id,
      mockData.visit_datetime,
      mockData.duration_minutes,
      mockData.observations,
      mockData.result
    ).subscribe({
      next: () => {
        fail('Esperaba que falle la solicitud');
      },
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/api/visits`);
    req.flush('Error en servidor', {
      status: 500,
      statusText: 'Server Error'
    });
  });


  it('should fetch clients correctly', () => {
    const mockClients = [{ id: '1', name: 'Cliente Uno' }, { id: '2', name: 'Cliente Dos' }];

    service.getClients().subscribe(clients => {
      expect(clients.length).toBe(2);
      expect(clients).toEqual(mockClients);
    });

    const req = httpMock.expectOne(`${apiUrl}/clients`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

  it('should handle error when fetching clients', () => {
    service.getClients().subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/clients`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});

