import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { DeliveriesService } from "../../services/deliveries.service";
import {throwError} from "rxjs";

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;
  let deliveriesService: jasmine.SpyObj<DeliveriesService>;

  const mockPedido = [
    { nombre: 'Producto A', precioTotal: 100 },
    { nombre: 'Producto B', precioTotal: 150 },
    { nombre: 'Otro producto', precioTotal: 50 }
  ];

  beforeEach(async () => {
    localStorage.setItem('detallePedidoConfirmado', JSON.stringify(mockPedido));

    const deliveriesServiceSpy = jasmine.createSpyObj('DeliveriesService',
      ['getProducts', 'addOrderToCart', 'confirmOrder']);

    await TestBed.configureTestingModule({
      imports: [
        OrderConfirmationComponent,
        FormsModule,
        IonicModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: DeliveriesService, useValue: deliveriesServiceSpy }
      ]
    }).compileComponents();

    deliveriesService = TestBed.inject(DeliveriesService) as jasmine.SpyObj<DeliveriesService>;
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

  it('should initialize order details from localStorage', () => {
    const mockOrder = {
      id: '123',
      items: [
        { product_id: '1', product_name: 'Product 1', quantity: 1, price: 100, subtotal: 100, status: 'confirmed' }
      ]
    };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockOrder));

    component.ngOnInit();

    expect(component.orderId).toBe('123');
    expect(component.detallePedido).toEqual(mockOrder.items);
  });

  it('should filter order details based on search term', () => {
    component.detallePedido = [
      { product_id: '1', product_name: 'Product 1', quantity: 1, price: 100, subtotal: 100, status: 'confirmed' },
      { product_id: '2', product_name: 'Product 2', quantity: 2, price: 200, subtotal: 400, status: 'confirmed' }
    ];
    component.terminoBusqueda = 'Product 1';

    const filteredDetails = component.detalleFiltrado;

    expect(filteredDetails.length).toBe(1);
    expect(filteredDetails[0].product_name).toBe('Product 1');
  });


  it('should calculate total order amount', () => {
    component.detallePedido = [
      { product_id: '1', product_name: 'Product 1', quantity: 1, price: 100, subtotal: 100, status: 'confirmed' },
      { product_id: '2', product_name: 'Product 2', quantity: 2, price: 200, subtotal: 400, status: 'confirmed' }
    ];

    const total = component.obtenerTotalPedido();

    expect(total).toBe(500);
  });


  it('should handle error when confirming order', () => {
    deliveriesService.confirmOrder.and.returnValue(throwError('Error'));

    spyOn(window, 'alert');

    component.orderId = '123';
    component.orderConfirmation();

    expect(deliveriesService.confirmOrder).toHaveBeenCalledWith('123');
    expect(window.alert).toHaveBeenCalledWith('Error confirming order. Please try again.');
  });
});

