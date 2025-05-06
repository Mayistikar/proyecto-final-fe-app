import { TestBed } from '@angular/core/testing';

import { ScheduledDeliveriesService } from './scheduled-deliveries.service';

describe('ScheduledDeliveriesService', () => {
  let service: ScheduledDeliveriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduledDeliveriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
