import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCreateCouponCodeComponent } from './bulk-create-coupon-code.component';

describe('BulkCreateCouponCodeComponent', () => {
  let component: BulkCreateCouponCodeComponent;
  let fixture: ComponentFixture<BulkCreateCouponCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCreateCouponCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCreateCouponCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
