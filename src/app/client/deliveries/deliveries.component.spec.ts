import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveriesComponent } from './deliveries.component';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { of, throwError } from 'rxjs';

describe('DeliveriesComponent', () => {
  let component: DeliveriesComponent;
  let fixture: ComponentFixture<DeliveriesComponent>;
  let deliveryServiceSpy: jasmine.SpyObj<DeliveriesService>;

  const mockProductos = [
    { id: '1', nombre: 'Producto A', stock: 10, precio: 100 },
    { id: '2', nombre: 'Producto B', stock: 5, precio: 50 },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DeliveriesService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [DeliveriesComponent],
      providers: [
        { provide: DeliveriesService, useValue: spy }
      ]
    }).compileComponents();

    deliveryServiceSpy = TestBed.inject(DeliveriesService) as jasmine.SpyObj<DeliveriesService>;
    deliveryServiceSpy.getProducts.and.returnValue(of(mockProductos));

    fixture = TestBed.createComponent(DeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos al inicializar', () => {
    expect(component.productos.length).toBe(2);
    expect(component.productos[0].nombre).toBe('Producto A');
  });

  it('debería seleccionar un producto correctamente', () => {
    const producto = mockProductos[0];
    component.seleccionarProducto(producto);
    expect(component.productoSeleccionado).toEqual(producto);
    expect(component.cantidadDeseada).toBe(0);
  });

  it('no debería agregar un producto si no hay selección', () => {
    spyOn(window, 'alert');
    component.cantidadDeseada = 1;
    component.agregarProducto();
    expect(window.alert).toHaveBeenCalledWith('Por favor selecciona un producto.');
  });

  it('no debería agregar si cantidad es inválida', () => {
    spyOn(window, 'alert');
    component.seleccionarProducto(mockProductos[0]);
    component.cantidadDeseada = 0;
    component.agregarProducto();
    expect(window.alert).toHaveBeenCalledWith('Ingresa una cantidad válida.');
  });

  it('no debería agregar si cantidad excede stock', () => {
    spyOn(window, 'alert');
    component.seleccionarProducto(mockProductos[0]);
    component.cantidadDeseada = 100;
    component.agregarProducto();
    expect(window.alert).toHaveBeenCalledWith('La cantidad supera el stock disponible.');
  });

  it('debería agregar producto correctamente al detalle', () => {
    const producto = mockProductos[0];
    component.seleccionarProducto(producto);
    component.cantidadDeseada = 2;
    component.agregarProducto();

    expect(component.detallePedido.length).toBe(1);
    expect(component.detallePedido[0].nombre).toBe('Producto A');
    expect(component.detallePedido[0].precioTotal).toBe(200);
    expect(producto.stock).toBe(8); // stock se reduce
  });

  it('debería calcular el total del pedido', () => {
    component.detallePedido = [
      { precioTotal: 100 },
      { precioTotal: 50.5 },
    ];
    const total = component.obtenerTotalPedido();
    expect(total).toBe(150.5);
  });

  it('debería confirmar el pedido y limpiar datos', () => {
    spyOn(window, 'alert');
    component.detallePedido = [{ nombre: 'Producto A', cantidad: 1, precioTotal: 100 }];
    component.confirmarOrden();
    expect(window.alert).toHaveBeenCalledWith('¡Pedido confirmado con éxito!');
    expect(component.detallePedido.length).toBe(0);
    expect(component.productoSeleccionado).toBeNull();
  });

  it('debería alertar si se intenta confirmar sin productos', () => {
    spyOn(window, 'alert');
    component.detallePedido = [];
    component.confirmarOrden();
    expect(window.alert).toHaveBeenCalledWith('Agrega productos al pedido antes de confirmar.');
  });

  it('debería filtrar productos por término de búsqueda', () => {
    component.terminoBusqueda = 'a';
    const filtrados = component.productosFiltrados;
    expect(filtrados.length).toBe(1);
    expect(filtrados[0].nombre).toBe('Producto A');
  });
});

