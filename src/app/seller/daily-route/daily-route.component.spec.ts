import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { DailyRouteComponent } from './daily-route.component';
import { DailyRouteService } from 'src/app/services/daily-route.service';

describe('DailyRouteComponent', () => {
  let component: DailyRouteComponent;
  let fixture: ComponentFixture<DailyRouteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule
      ],
      declarations: [DailyRouteComponent],
      providers: [
        {
          provide: DailyRouteService,
          useValue: jasmine.createSpyObj('DailyRouteService', ['getClientsBySellerId', 'getVisitsBySellerAndDate'])
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
