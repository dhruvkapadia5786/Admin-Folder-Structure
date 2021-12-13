import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCouponCodeComponent } from './edit-coupon-code.component';

describe('EditCouponCodeComponent', () => {
  let component: EditCouponCodeComponent;
  let fixture: ComponentFixture<EditCouponCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCouponCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCouponCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
