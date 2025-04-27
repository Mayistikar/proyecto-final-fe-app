import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SellerClientAssignmentComponent } from './seller-client-assignment.component';
import { AssignedClientsService } from 'src/app/services/assigned-clients.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('SellerClientAssignmentComponent', () => {
  let component: SellerClientAssignmentComponent;
  let fixture: ComponentFixture<SellerClientAssignmentComponent>;
  let assignedClientsServiceMock: any;

  const mockClients = [
    {
      id: '1',
      full_name: 'Juan Pérez',
      phone: '123',
      address: 'Calle 1',
      created_at: '2020-01-01'
    },
    {
      id: '2',
      full_name: 'Ana Gómez',
      phone: '456',
      address: 'Calle 2',
      created_at: '2020-02-01'
    }
  ];

  const mockAssignedClients = [
    {
      id: '3',
      full_name: 'Carlos Ruiz',
      phone: '789',
      address: 'Calle 3',
      created_at: '2020-03-01'
    }
  ];

  beforeEach(waitForAsync(() => {
    assignedClientsServiceMock = jasmine.createSpyObj('AssignedClientsService', [
      'getAssignedClients',
      'getClients',
      'postAssignedClients'
    ]);

    assignedClientsServiceMock.getAssignedClients.and.returnValue(of(mockAssignedClients));
    assignedClientsServiceMock.getClients.and.returnValue(of(mockClients));
    assignedClientsServiceMock.postAssignedClients.and.returnValue(of({ success: true }));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(), // Asegúrate de importar TranslateModule aquí
      ],
      providers: [
        { provide: AssignedClientsService, useValue: assignedClientsServiceMock },
        TranslateService // Añade el TranslateService aquí si es necesario
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerClientAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients correctly', () => {
    spyOn(component, 'loadClients').and.callThrough();
    component.loadClients();
    expect(component.loadClients).toHaveBeenCalled();
    expect(component.clients.length).toBe(2); 
  });

  it('should filter clients by search text', () => {
    component.clients = mockClients;
    component.searchText = 'Juan';
    const filteredClients = component.clientesFiltrados();
    expect(filteredClients.length).toBe(1);
    expect(filteredClients[0].full_name).toBe('Juan Pérez');
  });

  it('should not assign clients if no clients are selected', () => {
    spyOn(console, 'error');

    component.clients = [
      { id: '1', full_name: 'Juan', selected: false, phone: '111', address: 'Calle 1', created_at: '2020-01-01' },
      { id: '2', full_name: 'Ana', selected: false, phone: '222', address: 'Calle 2', created_at: '2020-02-01' }
    ];

    component.asignarClientesSeleccionados();

    expect(console.error).toHaveBeenCalledWith('No se encontró el ID del vendedor.');
    expect(assignedClientsServiceMock.postAssignedClients).not.toHaveBeenCalled();
  });

  it('should assign selected clients', () => {
    spyOn(localStorage, 'getItem').and.returnValue('123');

    component.clients = [
      {
        id: '1',
        full_name: 'Juan',
        phone: '111',
        address: 'Calle 1',
        created_at: '2024-04-01',
        selected: true,
        notes: ''
      }
    ];

    component.asignarClientesSeleccionados();

    expect(assignedClientsServiceMock.postAssignedClients).toHaveBeenCalledWith('123', [
      {
        id: '1',
        name: 'Juan',
        address: 'Calle 1',
        phone: '111',
        notes: ''
      }
    ]);
  });

});


