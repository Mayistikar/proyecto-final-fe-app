import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;

  const mockPedido = [
    { nombre: 'Producto A', precioTotal: 100 },
    { nombre: 'Producto B', precioTotal: 150 },
    { nombre: 'Otro producto', precioTotal: 50 }
  ];

  beforeEach(async () => {
    localStorage.setItem('detallePedidoConfirmado', JSON.stringify(mockPedido));

    await TestBed.configureTestingModule({
      imports: [
        OrderConfirmationComponent,
        FormsModule,
        IonicModule.forRoot(),
        TranslateModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar el pedido desde localStorage en ngOnInit', () => {
    expect(component.detallePedido.length).toBe(3);
    expect(component.detallePedido[0].nombre).toBe('Producto A');
  });

  it('debe calcular correctamente el total del pedido', () => {
    const total = component.obtenerTotalPedido();
    expect(total).toBe(300);
  });

  it('debe filtrar correctamente los productos por nombre', () => {
    component.terminoBusqueda = 'producto';
    const resultado = component.detalleFiltrado;
    expect(resultado.length).toBe(3);

    component.terminoBusqueda = 'A';
    expect(component.detalleFiltrado.length).toBe(1);
    expect(component.detalleFiltrado[0].nombre).toBe('Producto A');

    component.terminoBusqueda = 'no-existe';
    expect(component.detalleFiltrado.length).toBe(0);
  });

  it('debe limpiar el término de búsqueda correctamente', () => {
    component.terminoBusqueda = 'algo';
    component.limpiarBusqueda();
    expect(component.terminoBusqueda).toBe('');
  });
});

