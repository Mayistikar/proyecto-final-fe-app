import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientVisitService } from './client-visit.service';

describe('ClientVisitService', () => {
  let service: ClientVisitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ClientVisitService ]
    });
    service = TestBed.inject(ClientVisitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should register a client visit and return a successful response', () => {
    const dummyPayload = {
      visit_datetime: '2023-08-15T14:30:00',
      duration_minutes: 30,
      observations: 'Test observation',
      client_id: 'client123',
      result: 'INTERESTED'
    };
    const dummyResponse = { success: true };

    service.registerClientVisit(dummyPayload).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/visits`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyPayload);
    req.flush(dummyResponse);
  });

  it('should get clients', () => {
    const dummyClients = [
      { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789' },
      { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321' },
    ];

    service.getClients().subscribe((clients) => {
      expect(clients).toEqual(dummyClients);
      expect(clients.length).toBe(2);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/api/visits/seller/vendedor_authorized@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyClients);


  });

  it('should handle errors when getting clients', () => {

    spyOn(console, 'error');


    service.getClients().subscribe({
      next: () => fail('Debería haber fallado con un error'),
      error: (error) => {

        expect(console.error).toHaveBeenCalledWith('Error al obtener clientes:', jasmine.any(Object));
      }
    });


    const req = httpMock.expectOne(`${service['apiUrl']}/api/visits/seller/vendedor_authorized@example.com`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle errors when registering a client visit', () => {

    spyOn(console, 'error');

    const dummyPayload = {
      visit_datetime: '2023-08-15T14:30:00',
      duration_minutes: 30,
      observations: 'Test observation',
      client_id: 'client123',
      result: 'INTERESTED'
    };


    service.registerClientVisit(dummyPayload).subscribe({
      next: () => fail('Debería haber fallado con un error'),
      error: (error) => {

        expect(console.error).toHaveBeenCalledWith('Error al registrar visita:', jasmine.any(Object));
      }
    });


    const req = httpMock.expectOne(`${service['apiUrl']}/api/visits`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyPayload);
    req.error(new ErrorEvent('Network error'));
  });
});
