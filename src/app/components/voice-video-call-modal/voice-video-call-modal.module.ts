import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoiceVideoCallModalComponent } from './voice-video-call-modal.component';
import {VoiceVideoCallModalService} from './voice-video-call-modal.service';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [VoiceVideoCallModalComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  providers:[VoiceVideoCallModalService],
  exports:[VoiceVideoCallModalComponent]
})
export class VoiceVideoCallModalModule { }
