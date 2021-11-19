import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyUserManagementComponent } from './pharmacy-user-management.component';

describe('PharmacyUserManagementComponent', () => {
  let component: PharmacyUserManagementComponent;
  let fixture: ComponentFixture<PharmacyUserManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyUserManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
