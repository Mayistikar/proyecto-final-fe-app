import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DailyRouteService } from './daily-route.service';

describe('DailyRouteService', () => {
  let service: DailyRouteService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://kxa0nfrh14.execute-api.us-east-1.amazonaws.com/prod/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DailyRouteService]
    });
    service = TestBed.inject(DailyRouteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch clients by seller ID', () => {
    const mockClients = { clients: [{ id: '1', full_name: 'John Doe' }] };
    const sellerId = '123';

    service.getClientsBySellerId(sellerId).subscribe((data) => {
      expect(data.clients.length).toBe(1);
      expect(data.clients[0].full_name).toBe('John Doe');
    });

    const req = httpMock.expectOne(`${apiUrl}/sellers/${sellerId}/clients`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

  it('should fetch visits by seller email', () => {
    const mockVisits = { visits: [{ visit_date: '2025-05-07' }] };
    const email = 'test@example.com';

    service.getVisitsBySellerEmail(email).subscribe((visits) => {
      expect(visits.length).toBe(1);
      expect(visits[0].visit_date).toBe('2025-05-07');
    });

    const req = httpMock.expectOne(`${apiUrl}/visits/seller/${email}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVisits);
  });

  it('should filter visits by exact date', () => {
    const email = 'test@example.com';
    const date = '2025-05-07';

    const mockVisits = {
      visits: [
        { visit_date: '2025-05-07T08:00:00Z' },
        { visit_date: '2025-05-06T10:00:00Z' }
      ]
    };

    service.getVisitsBySellerAndDate(email, date).subscribe((filteredVisits) => {
      expect(filteredVisits.length).toBe(1);
      expect(new Date(filteredVisits[0].visit_date).toDateString()).toBe(new Date(date).toDateString());
    });

    const req = httpMock.expectOne(`${apiUrl}/visits/seller/${email}`);
    req.flush(mockVisits);
  });
});
