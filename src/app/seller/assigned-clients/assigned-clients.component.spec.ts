import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssignedClientsComponent } from './assigned-clients.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssignedClientsComponent', () => {
  let component: AssignedClientsComponent;
  let fixture: ComponentFixture<AssignedClientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AssignedClientsComponent, HttpClientTestingModule]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AssignedClientsComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // Tests para clientesFiltrados()
  describe('clientesFiltrados', () => {
    beforeEach(() => {
      // Configuramos datos de prueba para los clientes
      component.clients = [
        { id: '1', name: 'Cliente Uno', address: 'Dirección 1', phone: '123456789' },
        { id: '2', name: 'Cliente Dos', address: 'Dirección 2', phone: '987654321' },
        { id: '3', name: 'Persona tres', address: 'Dirección 3', phone: '555555555' }
      ];
    });

    it('should return all clients when searchText is empty', () => {
      component.searchText = '';
      const result = component.clientesFiltrados();
      expect(result).toEqual(component.clients);
      expect(result.length).toBe(3);
    });

    it('should filter clients by name when searchText has a value', () => {
      component.searchText = 'cliente';
      const result = component.clientesFiltrados();
      expect(result.length).toBe(2); // Solo 'Cliente Uno' y 'Cliente Dos'
      expect(result[0].name).toContain('Cliente');
      expect(result[1].name).toContain('Cliente');
    });

    it('should filter clients case-insensitive', () => {
      component.searchText = 'CLIENTE';
      const result = component.clientesFiltrados();
      expect(result.length).toBe(2);
    });

    it('should return empty array when no clients match the search', () => {
      component.searchText = 'xyz'; // No existe ningún cliente con este texto
      const result = component.clientesFiltrados();
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });
  });

  describe('clearSearch', () => {
    it('should clear searchText when called', () => {
      // Establecer un valor inicial para searchText
      component.searchText = 'texto de búsqueda';
      
      // Llamar a la función que queremos probar
      component.clearSearch();
      
      // Verificar que searchText ahora está vacío
      expect(component.searchText).toBe('');
    });
  });

  describe('actualizarLista', () => {
    it('should log a message to console when called', () => {
      // Crear un espía para console.log
      spyOn(console, 'log');
      
      // Llamar a la función que queremos probar
      component.actualizarLista();
      
      // Verificar que console.log fue llamado con el mensaje esperado
      expect(console.log).toHaveBeenCalledWith('Actualizar lista...');
    });
  });
});

