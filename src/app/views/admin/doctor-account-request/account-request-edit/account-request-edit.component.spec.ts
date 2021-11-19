import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRequestEditComponent } from './account-request-edit.component';

describe('AccountRequestEditComponent', () => {
  let component: AccountRequestEditComponent;
  let fixture: ComponentFixture<AccountRequestEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountRequestEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRequestEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
