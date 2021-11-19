import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundIncompleteOrdersComponent } from './refund-incomplete-orders.component';

describe('RefundIncompleteOrdersComponent', () => {
  let component: RefundIncompleteOrdersComponent;
  let fixture: ComponentFixture<RefundIncompleteOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundIncompleteOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundIncompleteOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
