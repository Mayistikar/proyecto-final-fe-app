import { TestBed, waitForAsync, inject } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DailyRouteComponent } from './daily-route.component';

describe('DailyRouteComponent', () => {
  let component: DailyRouteComponent;
  let fixture: ComponentFixture<DailyRouteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRouteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
