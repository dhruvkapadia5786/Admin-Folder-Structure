import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundRequestedDrugOrdersComponent } from './refund-requested-drug-orders.component';

describe('RefundRequestedDrugOrdersComponent', () => {
  let component: RefundRequestedDrugOrdersComponent;
  let fixture: ComponentFixture<RefundRequestedDrugOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundRequestedDrugOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundRequestedDrugOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
