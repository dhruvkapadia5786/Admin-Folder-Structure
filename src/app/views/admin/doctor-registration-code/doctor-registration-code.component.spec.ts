import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRegistrationCodeComponent } from './doctor-registration-code.component';

describe('DoctorRegistrationCodeComponent', () => {
  let component: DoctorRegistrationCodeComponent;
  let fixture: ComponentFixture<DoctorRegistrationCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorRegistrationCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorRegistrationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
