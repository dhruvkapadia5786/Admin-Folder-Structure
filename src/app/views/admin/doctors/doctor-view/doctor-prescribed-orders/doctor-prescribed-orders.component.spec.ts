import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPrescribedOrdersComponent } from './doctor-prescribed-orders.component';

describe('DoctorPrescribedOrdersComponent', () => {
  let component: DoctorPrescribedOrdersComponent;
  let fixture: ComponentFixture<DoctorPrescribedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorPrescribedOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorPrescribedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
