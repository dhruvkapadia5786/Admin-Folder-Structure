import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-free-form-consent-modal',
  templateUrl: './free-form-consent-modal.component.html',
  styleUrls: ['./free-form-consent-modal.component.scss']
})
export class FreeFormConsentModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  freeFormConsentMessageForm!: FormGroup;

  constructor(private _bsModalRef:BsModalRef) { }

  ngOnInit(): void {
    this.freeFormConsentMessageForm = new FormGroup({
      consent_message: new FormControl(null, [Validators.required])
     });
  }

  get consent_message() { return this.freeFormConsentMessageForm.get('consent_message'); }

  closeModal(){
    this._bsModalRef.hide()
  }

  freeFormConsentMessageFormSubmit(isValid:boolean){
      if(isValid){
        this.onEventCompleted.emit(this.freeFormConsentMessageForm.value);
        return true;
      }else{
        return false;
      }
  }
}
