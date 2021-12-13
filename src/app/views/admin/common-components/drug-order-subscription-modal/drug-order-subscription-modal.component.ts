import { Component, OnInit,Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Toastr } from 'src/app/services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {DrugOrderSubscriptionModalService} from './drug-order-subscription-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Router } from '@angular/router';

@Component({
  selector: 'app-drug-order-subscription-modal',
  templateUrl: './drug-order-subscription-modal.component.html',
  styleUrls: ['./drug-order-subscription-modal.component.scss']
})
export class DrugOrderSubscriptionModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  selectedSubscription:any;
  selectedDrug:any;

  ModalLabel='';
  ModalEvent='';
  priceObject:any;

  createSubscriptionForm:FormGroup;
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
    private router: Router,
    private _bsModalRef:BsModalRef,
    private _http: HttpClient,
    private _toastr: Toastr,
    private _cdr:ChangeDetectorRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _drugOrderSubscriptionModalService:DrugOrderSubscriptionModalService)
   {

    this.createSubscriptionForm=new FormGroup({
      order_id:new FormControl(null,[Validators.required]),
      drug_id:new FormControl(null,[Validators.required]),
      subscription_quantity:new FormControl(null,[Validators.required]),
      subscription_duration:new FormControl(null,[Validators.required])
    });

    this.changeSubscriptionForm=new FormGroup({
      subscription_id:new FormControl(null,[Validators.required]),
      medicine_name:new FormControl(null,[Validators.required]),
      custom_duration:new FormControl(null,[Validators.required])
    });

    this.delaySubscriptionForm=new FormGroup({
      delay_subscription_id:new FormControl(null,[Validators.required]),
      delay_medicine_name:new FormControl(null,[Validators.required]),
      delay_duration:new FormControl(null,[Validators.required])
    });


    this.actionRequiredSubscriptionForm=new FormGroup({
      action_subscription_id:new FormControl(null,[Validators.required]),
      action:new FormControl(null,[Validators.required])
    });
  }


  get subscription_id () {return this.changeSubscriptionForm.get('subscription_id');}
	get medicine_name () {return this.changeSubscriptionForm.get('medicine_name');}
	get custom_duration () {return this.changeSubscriptionForm.get('custom_duration');}

  get delay_subscription_id () {return this.delaySubscriptionForm.get('delay_subscription_id');}
  get delay_medicine_name () {return this.delaySubscriptionForm.get('delay_medicine_name');}
  get delay_duration () {return this.delaySubscriptionForm.get('delay_duration');}

  get action_subscription_id () {return this.actionRequiredSubscriptionForm.get('action_subscription_id');}
  get action () {return this.actionRequiredSubscriptionForm.get('action');}

  get order_id () {return this.createSubscriptionForm.get('order_id');}
  get drug_id () {return this.createSubscriptionForm.get('drug_id');}
  get subscription_quantity () {return this.createSubscriptionForm.get('subscription_quantity');}
  get subscription_duration () {return this.createSubscriptionForm.get('subscription_duration');}

  async ngOnInit(){
    let formdata = this._drugOrderSubscriptionModalService.getFormData();

    this.selectedDrug = formdata.drug?formdata.drug:null;
    this.selectedSubscription=formdata.subscription;
    this.selectedSubscription.medicine_name=formdata.subscription.drug_name+' '+formdata.subscription.drug_dosage+' '+formdata.subscription.subscription_quantity+' '+formdata.subscription.drug_form;

    this.ModalLabel='';
    this.ModalEvent=formdata.event;
    this.ModalLabel = formdata.event=='ACTIVATE'?'Activate Subscription':'Subscription Settings';

    if(this.ModalEvent=='ACTIVATE' || this.ModalEvent=='CREATE' || this.ModalEvent=='REFILL' || this.ModalEvent=='ACTION_REQUIRED'){
      const url =   `api/drugs/latest_price/${this.selectedSubscription.drug_id}?quantity=${this.selectedSubscription.subscription_quantity}`;
      this.priceObject =  await this._http.get(url).toPromise();
    }

    if(this.ModalEvent=='CREATE'){

      if(this.customFrequencyOptions.filter((item:any)=>item.days == formdata.subscription.duration).length==0){
        this.customFrequencyOptions.push({
          title:`Every ${formdata.subscription.duration} Days ${formdata.subscription.is_otc_order!=1?'As per your Prescription':''}`,
          days:formdata.subscription.duration
        });
      }

      this.createSubscriptionForm.patchValue({
        order_id:formdata.subscription.order_id,
        drug_id:formdata.subscription.drug_id,
        subscription_quantity:formdata.subscription.subscription_quantity,
        subscription_duration:formdata.subscription.duration
      });
    }

    if(this.ModalEvent=='ACTIVATE' || this.ModalEvent=='CHANGE'){
      this.changeSubscriptionForm.patchValue({
        subscription_id:this.selectedSubscription.id,
        medicine_name:this.selectedSubscription.medicine_name
      });
    }

    if(this.ModalEvent=='DELAYED'){
      this.delaySubscriptionForm.patchValue({
        delay_subscription_id:this.selectedSubscription.id,
        delay_medicine_name:this.selectedSubscription.medicine_name,
        delay_duration:7
      });
    }

    if(this.ModalEvent=='ACTION_REQUIRED'){
      this.actionRequiredSubscriptionForm.patchValue({
        action_subscription_id:this.selectedSubscription.id,
        action:null
      });
    }

  }

  deactivateSubscription(subscription:any){
    const url = 'api/drug_orders/cancle_subscription/' + this.selectedSubscription.order_id;
    let medicine_name=subscription.drug_name+' '+subscription.drug_dosage+' '+subscription.subscription_quantity+' '+subscription.drug_form;
    this._http.post(url, {
      subscription_id:subscription.id,
      medicine_name:medicine_name
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
    this.selectedDrug = null;
    this._bsModalRef.hide();
  }

  changeSubscriptionSubmit(formValid:boolean){
    if(formValid){
      let url:string;
      let message:string;
      let error_message:string;

      let formVal:any= this.changeSubscriptionForm.value;
      formVal.medicine_name= this.selectedSubscription.medicine_name;

      this.formSubmitting= true;

      if(this.ModalEvent=='ACTIVATE'){
         url = 'api/drug_orders/activate_subscription/' + this.selectedSubscription.order_id;
         message='Subscription Activated';
         error_message='Unable to activate subscription. Please try again';
      }else{
         formVal.event_type='CHANGE';
         url = 'api/drug_orders/change_subscription/' + this.selectedSubscription.order_id;
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
      return false;
    }
  }


  delaySubscriptionSubmit(formValid:boolean){
    if(formValid){
      let url:string;
      let message:string;
      let error_message:string;

      let formVal:any= this.delaySubscriptionForm.value;
      formVal.medicine_name= this.selectedSubscription.medicine_name;
      formVal.event_type='DELAYED';
      this.formSubmitting= true;

      url = 'api/drug_orders/change_subscription/' + this.selectedSubscription.order_id;
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
      return false;
    }
  }


  createSubscriptionSubmit(formValid:boolean){
     if(formValid){
      let url:string;
      let message:string;
      let error_message:string;
      let formVal:any= this.createSubscriptionForm.value;
      formVal.medicine_name= this.selectedSubscription.medicine_name;
      this.formSubmitting= true;

      url = 'api/drug_orders/create_subscription/' + this.selectedSubscription.order_id;
      message='Subscription Activated';
      error_message='Unable to activate subscription. Please try again';

      this._http.post(url,formVal).subscribe((data: any) => {

        this.createSubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this.onEventCompleted.emit(true);
        this._toastr.showSuccess(message);
      },err => {
        this.createSubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this.onEventCompleted.emit(true);
        this._toastr.showError(error_message);
      });
    }else{
      return false;
    }
  }


  actionRequiredSubscriptionSubmit(valid:boolean){
    if(valid){
      this.formSubmitting= true;
      let url = 'api/drug_orders/take_action_subscription/' + this.selectedSubscription.order_id;
      this._http.post(url,{
        subscription_id:this.actionRequiredSubscriptionForm.value.action_subscription_id,
        action:this.actionRequiredSubscriptionForm.value.action,
        medicine_name: this.selectedSubscription.medicine_name
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
      return false;
    }
  }

}
