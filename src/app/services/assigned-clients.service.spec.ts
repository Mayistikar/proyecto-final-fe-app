import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssignedClientsComponent } from '../seller/assigned-clients/assigned-clients.component';
import { AssignedClientsService, AssignedClient } from './assigned-clients.service';
import { of } from 'rxjs';

describe('AssignedClientsComponent', () => {
  let component: AssignedClientsComponent;
  let fixture: ComponentFixture<AssignedClientsComponent>;
  let assignedClientsService: AssignedClientsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedClientsComponent, HttpClientTestingModule], // Import the component and HttpClientTestingModule
      providers: [AssignedClientsService],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignedClientsComponent);
    component = fixture.componentInstance;
    assignedClientsService = TestBed.inject(AssignedClientsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch assigned clients', () => {
    const dummyClients: AssignedClient[] = [
      { id: '1', name: 'Client A', address: 'clientA@example.com', phone: '123456789' },
      { id: '2', name: 'Client B', address: 'clientB@example.com', phone: '987654321' },
    ];

    spyOn(assignedClientsService, 'getAssinedClients').and.returnValue(of(dummyClients));

    component.ngOnInit();

    expect(component.clients).toEqual(dummyClients);
    expect(assignedClientsService.getAssinedClients).toHaveBeenCalled();
  });
});











