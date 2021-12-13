import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundProcessedDrugOrdersComponent } from './refund-processed-drug-orders.component';

describe('RefundProcessedDrugOrdersComponent', () => {
  let component: RefundProcessedDrugOrdersComponent;
  let fixture: ComponentFixture<RefundProcessedDrugOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundProcessedDrugOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundProcessedDrugOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
