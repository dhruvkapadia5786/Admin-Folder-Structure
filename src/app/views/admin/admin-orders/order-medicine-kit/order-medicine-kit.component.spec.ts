import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderMedicineKitComponent } from './order-medicine-kit.component';

describe('MedicineKitComponent', () => {
  let component: OrderMedicineKitComponent;
  let fixture: ComponentFixture<OrderMedicineKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMedicineKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMedicineKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
