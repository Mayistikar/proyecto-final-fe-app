import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduledDeliveriesService } from './scheduled-deliveries.service';

describe('ScheduledDeliveriesService', () => {
  let service: ScheduledDeliveriesService;
  let httpMock: HttpTestingController;
  const mockClientId = 'testClientId';
  const mockOrders = [
    { order_id: 1, delivery_date: '2025-05-15', client_address: 'Address 1' },
    { order_id: 2, delivery_date: '2025-05-16', client_address: 'Address 2' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScheduledDeliveriesService],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()]
    });
    service = TestBed.inject(ScheduledDeliveriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve orders by client ID from the API', () => {
    service.getOrdersByClientId(mockClientId).subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/client_id/${mockClientId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should handle an error when retrieving orders and return an empty array', () => {
    const mockError = new Error('Simulated network error');

    service.getOrdersByClientId(mockClientId).subscribe(
      orders => {
        expect(orders).toEqual([]);
      },
      error => {
        expect(error).toBeTruthy();
        expect(error.message).toContain('Ocurrió un error al obtener los pedidos del cliente.');
      }
    );

    const req = httpMock.expectOne(`${service['baseUrl']}/client_id/${mockClientId}`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'), { status: 500, statusText: 'Server Error' });
  });

  it('should handle an HTTP error response and return an error observable', () => {
    const mockErrorResponse = { status: 404, statusText: 'Not Found' };
    let actualError: any;

    service.getOrdersByClientId(mockClientId).subscribe({
      next: () => fail('Should have failed with an error'),
      error: (err) => {
        actualError = err;
      },
      complete: () => fail('Should have failed with an error'),
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/client_id/${mockClientId}`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('HTTP error'), mockErrorResponse);
    expect(actualError).toBeTruthy();
    expect(actualError.message).toContain('Ocurrió un error al obtener los pedidos del cliente.');
  });
});
