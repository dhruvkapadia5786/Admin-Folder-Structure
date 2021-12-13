import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcSubscriptionModalComponent } from './otc-subscription-modal.component';

describe('OtcSubscriptionModalComponent', () => {
  let component: OtcSubscriptionModalComponent;
  let fixture: ComponentFixture<OtcSubscriptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcSubscriptionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcSubscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
