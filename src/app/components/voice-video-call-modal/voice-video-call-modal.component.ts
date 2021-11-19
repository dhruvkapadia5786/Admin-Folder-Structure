import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'
import {VoiceVideoCallModalService} from './voice-video-call-modal.service';

@Component({
  selector: 'app-voice-video-call-modal',
  templateUrl: './voice-video-call-modal.component.html',
  styleUrls: ['./voice-video-call-modal.component.scss']
})
export class VoiceVideoCallModalComponent implements OnInit {

  details:any ;
  @Output() voiceCallAccepted: EventEmitter<any> = new EventEmitter();
  @Output() voiceCallRejected: EventEmitter<any> = new EventEmitter();
  @Output() videoCallAccepted: EventEmitter<any> = new EventEmitter();
  @Output() videoCallRejected: EventEmitter<any> = new EventEmitter();

  constructor(
    private _bsModalRef:BsModalRef,
    private _voiceVideoCallModalService:VoiceVideoCallModalService){

  }

  ngOnInit(): void {
     this.details = this._voiceVideoCallModalService.getFormData();
  }

  closeModal(){
    this._bsModalRef.hide()
  }

  acceptIncomingCall(){
     this.voiceCallAccepted.emit(true);
     this.closeModal();
  }

  rejectIncomingCall(){
    this.voiceCallRejected.emit(true);
    this.closeModal();
  }

  acceptIncomingVideoCall(){
    this.videoCallAccepted.emit(true);
    this.closeModal();
  }

  rejectIncomingVideoCall(){
    this.videoCallRejected.emit(true);
    this.closeModal();
  }

}
