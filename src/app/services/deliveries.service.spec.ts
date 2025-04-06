import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeliveriesService } from './deliveries.service';

describe('DeliveriesService', () => {
  let service: DeliveriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeliveriesService]
    });
    service = TestBed.inject(DeliveriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // asegúrate que no quedan requests colgando
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products with GET request', () => {
    const mockData = [
      { id: '1', name: 'Product A' },
      { id: '2', name: 'Product B' }
    ];

    service.getProducts().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('https://67e8565920e3af747c4108d1.mockapi.io/api/v1/product');
    expect(req.request.method).toBe('GET');
    req.flush(mockData); // responde con datos falsos
  });

  it('should handle empty response gracefully', () => {
    service.getProducts().subscribe((data) => {
      expect(data).toEqual([]);
    });

    const req = httpMock.expectOne('https://67e8565920e3af747c4108d1.mockapi.io/api/v1/product');
    req.flush([]); // responde vacío
  });
});


