import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduledDeliveriesComponent } from './scheduled-deliveries.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScheduledDeliveriesService } from 'src/app/services/scheduled-deliveries.service';
import { of, throwError } from 'rxjs';

describe('ScheduledDeliveriesComponent', () => {
  let component: ScheduledDeliveriesComponent;
  let fixture: ComponentFixture<ScheduledDeliveriesComponent>;
  let scheduledDeliveriesService: ScheduledDeliveriesService;
  let httpMock: HttpTestingController;

  const mockDeliveries = [
    { order_id: 1, delivery_date: '2025-05-15T10:00:00.000Z', client_address: 'Address 1' },
    { order_id: 2, delivery_date: '2025-05-16T12:00:00.000Z', client_address: 'Address 2' },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({

      imports: [
        IonicModule.forRoot(),
        FormsModule,
        CommonModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ScheduledDeliveriesComponent
      ],
      providers: [ScheduledDeliveriesService],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('userId', 'testUserId');
    fixture = TestBed.createComponent(ScheduledDeliveriesComponent);
    component = fixture.componentInstance;
    scheduledDeliveriesService = TestBed.inject(ScheduledDeliveriesService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(localStorage, 'getItem').and.returnValue('testUserId');
  });

  afterEach(() => {
    httpMock.verify();
  });

  const setupSuccessfulLoad = () => {
    spyOn(scheduledDeliveriesService, 'getOrdersByClientId').and.returnValue(of(mockDeliveries));
    spyOn(component, 'applyAllFilters');
    fixture.detectChanges();
  };

  const setupFailedLoad = () => {
    spyOn(scheduledDeliveriesService, 'getOrdersByClientId').and.returnValue(
      throwError(() => new Error('API error'))
    );
    spyOn(console, 'error');
    fixture.detectChanges();
  };

  it('should create', () => {
    setupSuccessfulLoad();
    expect(component).toBeTruthy();
  });

  // it('should load deliveries on ngOnInit', () => {
  //   setupSuccessfulLoad();
  //   //expect(scheduledDeliveriesService.getOrdersByClientId).toHaveBeenCalledWith('testUserId');
  //   expect(component.allDeliveries).toEqual(mockDeliveries);
  //   expect(component.deliveries).toEqual(mockDeliveries);
  //   expect(component.applyAllFilters).toHaveBeenCalled();
  // });

  it('should handle error on ngOnInit', () => {
    setupFailedLoad();
    expect(component.allDeliveries).toEqual([]);
    expect(component.deliveries).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error obteniendo órdenes:', new Error('API error'));
  });

  it('should open the calendar', () => {
    component.showCalendar = false;
    component.openCalendar();
    expect(component.showCalendar).toBeTrue();
  });

  it('should set selectedDate and apply filters onDateSelected', () => {
    component.showCalendar = true;
    spyOn(component, 'applyAllFilters');
    const event = { detail: { value: '2025-05-10' } } as any;
    component.onDateSelected(event);
    expect(component.selectedDate).toEqual('2025-05-10');
    expect(component.showCalendar).toBeFalse();
    expect(component.applyAllFilters).toHaveBeenCalled();
  });

  it('should clear selectedDate and apply filters on clearDate', () => {
    component.selectedDate = '2025-05-10';
    spyOn(component, 'applyAllFilters');
    component.clearDate();
    expect(component.selectedDate).toBeNull();
    expect(component.applyAllFilters).toHaveBeenCalled();
  });

  it('should set searchTerm and apply filters on onSearchChange', () => {
    spyOn(component, 'applyAllFilters');
    const event = { detail: { value: 'test' } } as any;
    component.onSearchChange(event);
    expect(component.searchTerm).toEqual('test');
    expect(component.applyAllFilters).toHaveBeenCalled();
  });

  it('should filter deliveries by selectedDate', () => {
    const all = [
      { order_id: 1, delivery_date: '2025-05-15T10:00:00.000Z' },
      { order_id: 2, delivery_date: '2025-05-15T11:00:00.000Z' },
    ];
    component.selectedDate = '2025-05-15';
    const filtered = component.getFilteredByDate(all);
    expect(filtered.length).toBe(2);
    expect(filtered.map(d => d.order_id)).toEqual([1, 2]);
  });

  it('should return all deliveries if no selectedDate', () => {
    component.selectedDate = null;
    const filtered = component.getFilteredByDate(mockDeliveries);
    expect(filtered).toEqual(mockDeliveries);
  });

  it('should filter deliveries by index when searchTerm is a number', () => {
    component.searchTerm = '2';
    component.allDeliveries = mockDeliveries;
    component.applyAllFilters();
    expect(component.deliveries.length).toBe(1);
    expect(component.deliveries[0].order_id).toBe(2);
  });

  it('should set deliveries to empty array if searchTerm number is out of range', () => {
    component.searchTerm = '5';
    component.allDeliveries = mockDeliveries;
    component.applyAllFilters();
    expect(component.deliveries.length).toBe(0);
  });

  it('should set deliveries to empty array if searchTerm is not a number', () => {
    component.searchTerm = 'abc';
    component.allDeliveries = mockDeliveries;
    component.applyAllFilters();
    expect(component.deliveries.length).toBe(0);
  });


});

