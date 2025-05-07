/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DailyRouteService } from './daily-route.service';

describe('Service: DailyRoute', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DailyRouteService]
    });
  });

  it('should ...', inject([DailyRouteService], (service: DailyRouteService) => {
    expect(service).toBeTruthy();
  }));
});
