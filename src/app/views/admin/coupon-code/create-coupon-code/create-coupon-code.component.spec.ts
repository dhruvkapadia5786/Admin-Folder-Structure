import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCouponCodeComponent } from './create-coupon-code.component';

describe('CreateCouponCodeComponent', () => {
  let component: CreateCouponCodeComponent;
  let fixture: ComponentFixture<CreateCouponCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCouponCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCouponCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
