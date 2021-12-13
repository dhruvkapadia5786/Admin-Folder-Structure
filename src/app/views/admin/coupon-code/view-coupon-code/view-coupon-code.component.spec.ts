import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCouponCodeComponent } from './view-coupon-code.component';

describe('ViewCouponCodeComponent', () => {
  let component: ViewCouponCodeComponent;
  let fixture: ComponentFixture<ViewCouponCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCouponCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCouponCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
