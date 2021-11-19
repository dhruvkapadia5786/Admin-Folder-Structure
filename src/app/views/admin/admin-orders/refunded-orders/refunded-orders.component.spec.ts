import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundedOrdersComponent } from './refunded-orders.component';

describe('RefundedOrdersComponent', () => {
  let component: RefundedOrdersComponent;
  let fixture: ComponentFixture<RefundedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundedOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
