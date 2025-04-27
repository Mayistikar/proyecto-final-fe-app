import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssignedClientsComponent } from './assigned-clients.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('AssignedClientsComponent', () => {
  let component: AssignedClientsComponent;
  let fixture: ComponentFixture<AssignedClientsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AssignedClientsComponent, HttpClientTestingModule, TranslateModule.forRoot()]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AssignedClientsComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  
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
      
      spyOn(console, 'log');
      
      
      component.actualizarLista();
      
      
      expect(console.log).toHaveBeenCalledWith('Actualizaciones realizadas: 1');
    });
  });

  describe('guardarNota', () => {
    it('should add a new note and save to localStorage', () => {
      
      component.generalNote = 'Nueva nota';
      spyOn(localStorage, 'setItem'); 

      // Llamar al método
      component.guardarNota();

      
      expect(component.generalNotesList).toContain('Nueva nota');
      expect(localStorage.setItem).toHaveBeenCalledWith('notasGeneralesClientes', JSON.stringify(component.generalNotesList));
      expect(component.generalNote).toBe('');
    });

    it('should not add an empty note', () => {
      
      component.generalNote = '';
      spyOn(localStorage, 'setItem'); 

      // Llamar al método
      component.guardarNota();

      // Verificar que no se ha agregado nada
      expect(component.generalNotesList.length).toBe(0);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('loadNotes', () => {
    it('should load notes from localStorage', () => {
      // Simulamos que existen notas en localStorage
      const notes = ['Nota 1', 'Nota 2'];
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(notes));

      
      component.loadNotes();

      
      expect(component.generalNotesList).toEqual(notes);
    });

    it('should not load notes if nothing is stored in localStorage', () => {
      // Simulamos que no hay notas en localStorage
      spyOn(localStorage, 'getItem').and.returnValue(null);

      
      component.loadNotes();

      
      expect(component.generalNotesList).toEqual([]);
    });
  });

  describe('eliminarNotas', () => {
    it('should clear all notes from localStorage and the list', () => {
      
      component.generalNotesList = ['Nota 1', 'Nota 2'];
      spyOn(localStorage, 'removeItem'); 

      
      component.eliminarNotas();

      
      expect(component.generalNotesList.length).toBe(0);
      expect(localStorage.removeItem).toHaveBeenCalledWith('notasGeneralesClientes');
    });
  });

  describe('eliminarNota', () => {
    it('should remove a note by index', () => {
      
      component.generalNotesList = ['Nota 1', 'Nota 2', 'Nota 3'];
      spyOn(component, 'guardarNotasEnLocalStorage');

      
      component.eliminarNota(1);

      
      expect(component.generalNotesList).toEqual(['Nota 1', 'Nota 3']);
      expect(component.guardarNotasEnLocalStorage).toHaveBeenCalled();
    });
  });

  describe('guardarNotasEnLocalStorage', () => {
    it('should save notes to localStorage', () => {
      component.generalNotesList = ['Nota 1', 'Nota 2'];
      spyOn(localStorage, 'setItem'); // Espiar setItem

      
      component.guardarNotasEnLocalStorage();

      
      expect(localStorage.setItem).toHaveBeenCalledWith('generalNotesList', JSON.stringify(component.generalNotesList));
    });
  });
});

