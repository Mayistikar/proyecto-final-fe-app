import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeliveriesService, Product, Order } from './deliveries.service';

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
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const dummyProducts: Product[] = [
      { id: '1', name: 'Producto A', description: 'Descripción del Producto A', price: 100, category: 'Categoría A', stock: 10, image: 'assets/producto-a.jpg', created_at: '2023-01-01T00:00:00Z' },
      { id: '2', name: 'Producto B', description: 'Descripción del Producto B', price: 50, category: 'Categoría B', stock: 5, image: 'assets/producto-b.jpg', created_at: '2023-02-01T00:00:00Z' }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

});
