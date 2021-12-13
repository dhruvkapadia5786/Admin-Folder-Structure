import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubscriptionModalComponent } from './order-subscription-modal.component';

describe('OrderSubscriptionModalComponent', () => {
  let component: OrderSubscriptionModalComponent;
  let fixture: ComponentFixture<OrderSubscriptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSubscriptionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
