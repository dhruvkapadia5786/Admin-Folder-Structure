import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDrugOrdersComponent } from './admin-drug-orders.component';

describe('AdminDrugOrdersComponent', () => {
  let component: AdminDrugOrdersComponent;
  let fixture: ComponentFixture<AdminDrugOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDrugOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDrugOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
