import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralTransactionsComponent } from './referral-transactions.component';

describe('ReferralTransactionsComponent', () => {
  let component: ReferralTransactionsComponent;
  let fixture: ComponentFixture<ReferralTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
