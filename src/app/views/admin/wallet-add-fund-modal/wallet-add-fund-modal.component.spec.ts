import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAddFundModalComponent } from './wallet-add-fund-modal.component';

describe('WalletAddFundModalComponent', () => {
  let component: WalletAddFundModalComponent;
  let fixture: ComponentFixture<WalletAddFundModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletAddFundModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletAddFundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
