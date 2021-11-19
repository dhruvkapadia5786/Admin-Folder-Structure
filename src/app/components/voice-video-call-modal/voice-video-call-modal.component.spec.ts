import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceVideoCallModalComponent } from './voice-video-call-modal.component';

describe('VideoCallModalComponent', () => {
  let component: VoiceVideoCallModalComponent;
  let fixture: ComponentFixture<VoiceVideoCallModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceVideoCallModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceVideoCallModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
