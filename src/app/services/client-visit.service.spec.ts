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
});
