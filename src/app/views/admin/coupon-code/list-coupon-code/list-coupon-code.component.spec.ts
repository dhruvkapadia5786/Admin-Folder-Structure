import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCouponCodeComponent } from './list-coupon-code.component';

describe('ListCouponCodeComponent', () => {
  let component: ListCouponCodeComponent;
  let fixture: ComponentFixture<ListCouponCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCouponCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCouponCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
