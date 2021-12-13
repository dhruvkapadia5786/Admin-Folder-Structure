import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponTransactionsComponent } from './coupon-transactions.component';

describe('CouponTransactionsComponent', () => {
  let component: CouponTransactionsComponent;
  let fixture: ComponentFixture<CouponTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
