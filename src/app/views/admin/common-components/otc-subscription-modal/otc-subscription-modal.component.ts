import { Component, OnInit,Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Toastr } from 'src/app/services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {OtcSubscriptionModalService} from './otc-subscription-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-otc-subscription-modal',
  templateUrl: './otc-subscription-modal.component.html',
  styleUrls: ['./otc-subscription-modal.component.scss']
})
export class OtcSubscriptionModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  selectedSubscription:any;
  priceObject:any;

  ModalLabel='';
  ModalEvent='';
  changeSubscriptionForm:FormGroup;
  delaySubscriptionForm:FormGroup;
  actionRequiredSubscriptionForm:FormGroup;
  formSubmitting:boolean=false;

  customFrequency: number=30;

  delayFrequencyOptions=[3,7,10,15,30];

	customFrequencyOptions = [
    {
      title:'Every Day',
      days:1
    },
    {
      title:'Every 3 Day',
      days:3
    },
    {
      title:'Every Week',
      days:7
    },
    {
      title:'Every 15 Days',
      days:15
    },
    {
      title:'Every 30 Days',
      days:30
    },
    {
      title:'Every 45 Days',
      days:45
    },
    {
      title:'Every 60 Days',
      days:60
    },
    {
      title:'Every 75 Days',
      days:75
    },
    {
      title:'Every 90 Days',
      days:90
    },
    {
      title:'Every 120 Days',
      days:120
    },
  ];


  constructor(
    private _bsModalRef:BsModalRef,
    private _http: HttpClient,
    private _toastr: Toastr,
    private _cdr:ChangeDetectorRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _otcSubscriptionModalService:OtcSubscriptionModalService)
   {


    this.changeSubscriptionForm=new FormGroup({
      medicine_name:new FormControl(null,[Validators.required]),
      custom_duration:new FormControl(null,[Validators.required])
    });

    this.delaySubscriptionForm=new FormGroup({
      delay_medicine_name:new FormControl(null,[Validators.required]),
      delay_duration:new FormControl(null,[Validators.required])
    });


    this.actionRequiredSubscriptionForm=new FormGroup({
      action:new FormControl(null,[Validators.required])
    });
  }

	get medicine_name () {return this.changeSubscriptionForm.get('medicine_name');}
	get custom_duration () {return this.changeSubscriptionForm.get('custom_duration');}
  get delay_medicine_name () {return this.delaySubscriptionForm.get('delay_medicine_name');}
  get delay_duration () {return this.delaySubscriptionForm.get('delay_duration');}
  get action () {return this.actionRequiredSubscriptionForm.get('action');}

  async ngOnInit(){
    let formdata = this._otcSubscriptionModalService.getFormData();
    console.log('formdata =',formdata);

    this.selectedSubscription=formdata.subscription;

    this.ModalLabel='';
    this.ModalEvent=formdata.event;
    this.ModalLabel = formdata.event=='ACTIVATE' || formdata.event=='RE_ACTIVATE_BY_TECH' ?'Activate Subscription':'Subscription Settings';

    if(this.ModalEvent=='ACTIVATE' || this.ModalEvent=='RE_ACTIVATE_BY_TECH' || this.ModalEvent=='CREATE' || this.ModalEvent=='REFILL' || this.ModalEvent=='ACTION_REQUIRED'){
      const url =   `api/drugs/latest_price/${this.selectedSubscription.drug_id}?quantity=${this.selectedSubscription.subscription_quantity}`;
      this.priceObject =  await this._http.get(url).toPromise();
    }

    if(this.ModalEvent=='ACTIVATE' || this.ModalEvent=='RE_ACTIVATE_BY_TECH' ||  this.ModalEvent=='CHANGE'){
      this.changeSubscriptionForm.patchValue({
        medicine_name:this.selectedSubscription.otc_drug_name
      });
    }

    if(this.ModalEvent=='DELAYED'){
      this.delaySubscriptionForm.patchValue({
        delay_medicine_name:this.selectedSubscription.otc_drug_name,
        delay_duration:7
      });
    }

    if(this.ModalEvent=='ACTION_REQUIRED'){
      this.actionRequiredSubscriptionForm.patchValue({
        action:null
      });
    }

  }

  deactivateSubscription(subscription:any){
    const url = 'api/v1/otc-subscription/cancle_subscription/' +subscription.id
    this._http.post(url,{
      order_id:this.selectedSubscription.order_id,
      medicine_name:subscription.otc_drug_name
    }).subscribe((data:any) => {
        this._toastr.showSuccess('Subscription Deactivated Successfully');
        this.onEventCompleted.emit(true);
        this.closeModal();
      }, err => {
        this._toastr.showError('Unable to deactivate subscription. Please try again');
        this.onEventCompleted.emit(true);
        this.closeModal();
      });
  }

  closeModal(){
    this.ModalEvent='';
    this.ModalLabel='';
    this.selectedSubscription=null;
    this._bsModalRef.hide();
  }

  changeSubscriptionSubmit(formValid:boolean){
    if(formValid){
      let url:string;
      let message:string;
      let error_message:string;

      let formVal:any= this.changeSubscriptionForm.value;
      formVal.medicine_name= this.selectedSubscription.otc_drug_name;
      formVal.order_id = this.selectedSubscription.order_id;
      this.formSubmitting= true;

      if(this.ModalEvent=='ACTIVATE' || this.ModalEvent=='RE_ACTIVATE_BY_TECH'){
         url = 'api/v1/otc-subscription/activate_subscription/' + this.selectedSubscription.id;
         message='Subscription Activated';
         error_message='Unable to activate subscription. Please try again';
      }else{
         formVal.event_type='CHANGE';
         url = 'api/v1/otc-subscription/change_subscription/' + this.selectedSubscription.id;
         message='Subscription Changed';
         error_message='Unable to change subscription. Please try again';
      }

      this._http.post(url,formVal).subscribe((data: any) => {

        this.changeSubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this.onEventCompleted.emit(true);
        this._toastr.showSuccess(message);
      },err => {
        this.changeSubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this.onEventCompleted.emit(true);
        this._toastr.showError(error_message);
      });
    }else{
      return ;
    }
  }


  delaySubscriptionSubmit(formValid:boolean){
    if(formValid){
      let url:string;
      let message:string;
      let error_message:string;

      let formVal:any= this.delaySubscriptionForm.value;
      formVal.medicine_name= this.selectedSubscription.otc_drug_name;
      formVal.event_type='DELAYED';
      formVal.order_id = this.selectedSubscription.order_id;

      this.formSubmitting= true;

      url = 'api/v1/otc-subscription/change_subscription/' +   this.selectedSubscription.id;
      message=`Subscription Paused For ${formVal.delay_duration} Days`;
      error_message='Unable to pause subscription. Please try again';

      this._http.post(url,formVal).subscribe((data: any) => {
        this.delaySubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this.onEventCompleted.emit(true);
        this._toastr.showSuccess(message);
      },err => {
        this.delaySubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this.onEventCompleted.emit(true);
        this._toastr.showError(error_message);
      });
    }else{
      return ;
    }
  }


  actionRequiredSubscriptionSubmit(valid:boolean){
    if(valid){
      this.formSubmitting= true;
      let url = 'api/v1/otc-subscription/take_action_subscription/' + this.selectedSubscription.id;
      this._http.post(url,{
        order_id : this.selectedSubscription.order_id,
        action:this.actionRequiredSubscriptionForm.value.action,
        medicine_name: this.selectedSubscription.otc_drug_name
      }).subscribe((data:any) => {
        this.formSubmitting= false;
          this._toastr.showSuccess('Subscription Updated Successfully');
          this.actionRequiredSubscriptionForm.reset();
          this.onEventCompleted.emit(true);
          this.closeModal();
        }, err => {
          this.formSubmitting= false;
          this.actionRequiredSubscriptionForm.reset();
          this._toastr.showError('Unable to update. Please try again');
          this.onEventCompleted.emit(true);
          this.closeModal();
        });
    }else{
      return ;
    }
  }


}
