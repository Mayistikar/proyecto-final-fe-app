import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScheduledDeliveriesComponent } from './scheduled-deliveries.component';

describe('ScheduledDeliveriesComponent', () => {
  let component: ScheduledDeliveriesComponent;
  let fixture: ComponentFixture<ScheduledDeliveriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScheduledDeliveriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduledDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
