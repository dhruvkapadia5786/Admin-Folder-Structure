import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRequestRegistrationComponent } from './account-request-registration.component';

describe('AccountRequestRegistrationComponent', () => {
  let component: AccountRequestRegistrationComponent;
  let fixture: ComponentFixture<AccountRequestRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRequestRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRequestRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
