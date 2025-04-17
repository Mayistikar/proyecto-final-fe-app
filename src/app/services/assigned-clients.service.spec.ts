import { AssignedClientsService } from "./assigned-clients.service";
import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";




describe('AssingedClientService()', () => {
  let service: AssignedClientsService;
  let httpMock : HttpTestingController;

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

  it('should get all assined clients', () => {
    const dummyClients = [
      { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789' },
      { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321' },
    ];

    service.getAssinedClients().subscribe((clients) => {
      expect(clients).toEqual(dummyClients);
      expect(clients.length).toBe(2);
    });

    const req = httpMock.expectOne('https://67e8565920e3af747c4108d1.mockapi.io/api/v1/clients');
    expect(req.request.method).toBe('GET');
    req.flush(dummyClients);
  });



  
});












