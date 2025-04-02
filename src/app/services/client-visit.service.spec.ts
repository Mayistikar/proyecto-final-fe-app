import { TestBed } from '@angular/core/testing';

import { ClientVisitService } from './client-visit.service';

describe('ClientVisitService', () => {
  let service: ClientVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
