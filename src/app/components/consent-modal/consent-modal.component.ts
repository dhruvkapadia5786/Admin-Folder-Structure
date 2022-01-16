import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal'
import {ConsentModalService} from './consent-modal.service';

@Component({
  selector: 'app-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.scss']
})
export class ConsentModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  consentForm: FormGroup;

  constructor(private _consentModalService:ConsentModalService,
    private _bsModalRef:BsModalRef) {
    this.consentForm = new FormGroup({
			eventName: new FormControl(null, []),
			answerId: new FormControl(null, [Validators.required]),
			consentMsg: new FormControl(null, [Validators.required])
		});
  }

  get eventName(){ return this.consentForm.get('eventName');}
	get answerId() { return this.consentForm.get('answerId'); }
	get consentMsg() { return this.consentForm.get('consentMsg'); }

  ngOnInit(): void {
     let data:any = this._consentModalService.getFormData();
     if(data){
        this.consentForm.patchValue({
          eventName:data.eventName,
          answerId:data.answerId,
          consentMsg:data.consentMsg
        });
     }
  }

  closeModal(){
    this._bsModalRef.hide()
		this.consentForm.reset();
	}


	sendConsent(formValid:boolean) {
    if(formValid){
      this.onEventCompleted.emit(this.consentForm.value);
      return true;
    }else{
      return false;
    }
  }

}
