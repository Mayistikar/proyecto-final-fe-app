import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SellerClientAssignmentComponent } from './seller-client-assignment.component';

describe('SellerClientAssignmentComponent', () => {
  let component: SellerClientAssignmentComponent;
  let fixture: ComponentFixture<SellerClientAssignmentComponent>;

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

  const assignedClientsServiceMock = {
    getAssinedClients: jasmine.createSpy('getAssinedClients').and.returnValue(of(mockClients))
  };

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

  

  it('should return all clients if search text is empty', () => {
    component.clients = mockClients;
    component.searchText = '';
    const result = component.clientesFiltrados();
    expect(result.length).toBe(2);
  });

  it('should reload clients on updateClients()', () => {
    spyOn(component, 'loadClients');
    component.updateClients();
    expect(component.loadClients).toHaveBeenCalled();
  });

  it('should log selected clients', () => {
    spyOn(console, 'log');
    component.clients = [
      { ...mockClients[0], selected: true },
      { ...mockClients[1], selected: false }
    ];
    component.asignarClientesSeleccionados();
    expect(console.log).toHaveBeenCalledWith('Clientes seleccionados para asignar:', [
      jasmine.objectContaining({ full_name: 'Juan Pérez' })
    ]);
  });
});
