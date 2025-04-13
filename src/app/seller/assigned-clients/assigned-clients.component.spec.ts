import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignedClientsComponent } from './assigned-clients.component';

describe('AssignedClientsComponent', () => {
  let component: AssignedClientsComponent;
  let fixture: ComponentFixture<AssignedClientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AssignedClientsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignedClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
