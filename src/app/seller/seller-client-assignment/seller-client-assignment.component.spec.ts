import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SellerClientAssignmentComponent } from './seller-client-assignment.component';

describe('SellerClientAssignmentComponent', () => {
  let component: SellerClientAssignmentComponent;
  let fixture: ComponentFixture<SellerClientAssignmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SellerClientAssignmentComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SellerClientAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
