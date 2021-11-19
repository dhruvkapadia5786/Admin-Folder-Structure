import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwilioSmsComponent } from './twilio-sms.component';

describe('TwilioSmsComponent', () => {
  let component: TwilioSmsComponent;
  let fixture: ComponentFixture<TwilioSmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwilioSmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwilioSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
