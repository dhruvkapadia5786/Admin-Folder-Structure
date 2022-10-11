import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RefundDrugModalService } from './refund-drug-modal.service';

@Component({
  selector: 'app-refund-drug-modal',
  templateUrl: './refund-drug-modal.component.html',
  styleUrls: ['./refund-drug-modal.component.scss']
})
export class RefundDrugModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  order!: any;
  refundOrderForm:FormGroup
  all_drugs_for_refund_length: number = 0

  constructor(
    private _bsModalRef: BsModalRef,
    private _refundDrugModalService: RefundDrugModalService
  ) {
    this.refundOrderForm = new FormGroup({
      'selected_drug_ids':new FormControl([], [Validators.required]),
      'refund_reason':new FormControl(null, [Validators.required]),
    });
  }

  get selected_drug_ids(){return this.refundOrderForm.get('selected_drug_ids');}
  get refund_reason(){return this.refundOrderForm.get('refund_reason');}

  ngOnInit(): void {
    var refund_reason=this.refundOrderForm.get('refund_reason');
    if(refund_reason)refund_reason.disable();

    let details = this._refundDrugModalService.getData();
    if(details) {
      this.order = details.order;
      this.all_drugs_for_refund_length = details.all_drugs_for_refund_length;
    }
  }

  refundOrderFormSubmit(form: any) {
    if(form.valid) {
      this.onEventCompleted.emit(form);
      this.closeModal();
    }
  }

  checkDrugDisabledForRefund(drug:any){
    return (drug.order_drug_status == 'REFUND_REQUESTED'  || drug.order_drug_status == 'REFUND_PROCESSED')?true:false;
  }

  checkDrugSelectedForRefund(drug:any){
    let oldValue= this.refundOrderForm.value.selected_drug_ids || [];
    return  oldValue.indexOf(drug.id)!=-1?true:false;
  }

  checkSelectAllOptionForEvent(event_name:string) {
    let formValue= this.refundOrderForm.value.selected_drug_ids || [];
    let checked =  this.all_drugs_for_refund_length>0 && formValue.length==this.all_drugs_for_refund_length;
    var refund_reason=this.refundOrderForm.get('refund_reason');
    if(this.refundOrderForm.value.selected_drug_ids.length>0){
      if(refund_reason)refund_reason.enable();
    }else{
      if(refund_reason)refund_reason.disable();
    }
    return checked;
  }

  handleSelectAllDrugs(event_name:string,event:any) {
    let checked =  event.target.checked;
    if(checked){
      this.refundOrderForm.patchValue({selected_drug_ids:[]});
      let oldValue= this.refundOrderForm.value.selected_drug_ids;
      for(let drug of this.order.products){
          let is_disabled= this.checkDrugDisabledForRefund(drug);
          if(!is_disabled){
            oldValue.push(drug.id);
            this.refundOrderForm.patchValue({selected_drug_ids:oldValue});
          }
      }
    }else{
      this.refundOrderForm.patchValue({selected_drug_ids:[]});
    }
  }

  selectDrug(drug:any,event:any){
    let oldValue= this.refundOrderForm.value.selected_drug_ids || [];

     if(event.target.checked){
      if(oldValue && oldValue.indexOf(drug.id)==-1){
        oldValue.push(drug.id);
        this.refundOrderForm.patchValue({selected_drug_ids:oldValue});
      }
     }else{
       if(oldValue && oldValue.indexOf(drug.id)!=-1){
        let indexFound = this.refundOrderForm.value.selected_drug_ids.indexOf(drug.id);
         oldValue.splice(indexFound, 1);
         this.refundOrderForm.patchValue({selected_drug_ids:oldValue});
       }
     }
     this.checkSelectAllOptionForEvent('REFUND');
  }

  closeModal() {
    this._bsModalRef.hide();
  }
}
