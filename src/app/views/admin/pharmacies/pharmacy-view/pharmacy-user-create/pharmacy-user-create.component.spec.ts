import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyUserCreateComponent } from './pharmacy-user-create.component';

describe('PharmacyUserCreateComponent', () => {
  let component: PharmacyUserCreateComponent;
  let fixture: ComponentFixture<PharmacyUserCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyUserCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
