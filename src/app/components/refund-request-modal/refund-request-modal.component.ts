import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-refund-request-modal',
  templateUrl: './refund-request-modal.component.html',
  styleUrls: ['./refund-request-modal.component.scss']
})
export class RefundRequestModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  refundRequestForm!: FormGroup;

  constructor(private _bsModalRef:BsModalRef) { }

  ngOnInit(): void {
    this.refundRequestForm = new FormGroup({
      refund_reason: new FormControl(null, [Validators.required])
    });
  }

  get refund_reason() { return this.refundRequestForm.get('refund_reason'); }

  closeModal(){
    this._bsModalRef.hide()
  }

  refundRequestFormSubmit(isValid:boolean){
      if(isValid){
        this.onEventCompleted.emit(this.refundRequestForm.value);
        this.closeModal();
        return true;
      }else{
        return false;
      }
  }
}
