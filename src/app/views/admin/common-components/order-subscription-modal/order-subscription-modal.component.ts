import { Component, OnInit,Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Toastr } from 'src/app/services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import {OrderSubscriptionModalService} from './order-subscription-modal.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-order-subscription-modal',
  templateUrl: './order-subscription-modal.component.html',
  styleUrls: ['./order-subscription-modal.component.scss']
})
export class OrderSubscriptionModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  selectedSubscription:any=null;
  selectedKitDetails:any=null;
  reOrderApiCallObservable!: Observable<any>;

  formSubmitting:boolean=false;
  changeSubscriptionForm:FormGroup;
  delaySubscriptionForm:FormGroup;

  ModalEvent:string='';
  ModalLabel='';

  checkBoxChecked:boolean=false;
  refillTypeSelected='auto';
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
    private _orderSubscriptionModalService:OrderSubscriptionModalService){


    this.changeSubscriptionForm=new FormGroup({
        order_id:new FormControl(null,[Validators.required]),
        custom_duration:new FormControl(null,[Validators.required])
    });

    this.delaySubscriptionForm=new FormGroup({
      delay_subscription_order_id:new FormControl(null,[Validators.required]),
      delay_medicine_name:new FormControl(null,[Validators.required]),
      delay_duration:new FormControl(null,[Validators.required])
    });


  }

  get order_id(){ return this.changeSubscriptionForm.get('order_id'); }
	get custom_duration () {return this.changeSubscriptionForm.get('custom_duration');}

  get delay_subscription_order_id () {return this.delaySubscriptionForm.get('delay_subscription_order_id');}
  get delay_medicine_name () {return this.delaySubscriptionForm.get('delay_medicine_name');}
  get delay_duration () {return this.delaySubscriptionForm.get('delay_duration');}


  async ngOnInit() {
    let formdata = this._orderSubscriptionModalService.getFormData();

    this.ModalEvent=formdata.event;
    if(formdata.event=='DEACTIVATE' || formdata.event=='DELAYED' || formdata.event=='CHANGE'  || formdata.event=='RE_ACTIVATE_BY_TECH'){
      this.selectedSubscription = formdata.order;

      if(formdata.event=='DELAYED'){

        this.delaySubscriptionForm.patchValue({
          delay_subscription_order_id:this.selectedSubscription.order_id,
          delay_medicine_name:this.selectedSubscription.kit_name,
          delay_duration:7
        });

      }

      if(formdata.event=='CHANGE'){
        this.changeSubscriptionForm.patchValue({
          order_id:this.selectedSubscription.order_id
        });
      }
    }
  }

  closeModal(){
    this.ModalEvent='';
    this.ModalLabel='';
    this.selectedSubscription = null;
    this.selectedKitDetails=null;
    this.onEventCompleted.emit(true);
    this._bsModalRef.hide();
  }


  handleDeactivateSubscription(){
    const url = 'api/subscription/cancle/' + this.selectedSubscription.order_id;
      this._http.post(url, {}).subscribe(data => {
        this._toastr.showSuccess('Subscription Deactivated Successfully');
        this.closeModal();
      }, err => {
        this.closeModal();
        this._toastr.showError('Unable to deactivate subscription. Please try again');
      });
  }

  delaySubscriptionSubmit(formValid:boolean){
    if(formValid){
      let url:string;
      let message:string;
      let error_message:string;

      let formVal:any= this.delaySubscriptionForm.value;
      formVal.order_id = this.delaySubscriptionForm.value.delay_subscription_order_id;
      formVal.event_type='DELAYED';
      this.formSubmitting= true;
      url = 'api/subscription/update/' + this.selectedSubscription.order_id;
      message=`Subscription Paused For ${formVal.delay_duration} Days`;
      error_message='Unable to pause subscription. Please try again';
      this._http.post(url,formVal).subscribe((data: any) => {
        this.delaySubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this._toastr.showSuccess(message);
      },err => {
        this.delaySubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this._toastr.showError(error_message);
      });
    }else{
      return ;
    }
  }


  changeSubscriptionSubmit(formValid:boolean){
    if(formValid){
      let url:string;
      let message:string;
      let error_message:string;

      let formVal:any= this.changeSubscriptionForm.value;
      this.formSubmitting= true
      formVal.event_type='CHANGE';
      url = 'api/subscription/update/' + this.selectedSubscription.order_id;
      message='Subscription Changed';
      error_message='Unable to change subscription. Please try again';

      this._http.post(url,formVal).subscribe((data: any) => {
        this.changeSubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this._toastr.showSuccess(message);
      },err => {
        this.changeSubscriptionForm.reset();
        this.formSubmitting= false;
        this.closeModal();
        this._toastr.showError(error_message);
      });
    }else{
      return ;
    }
  }


  handleReActivateSubscriptionByTechnician(event:any){
    event.preventDefault();
    const url = 'api/subscription/re-activate/' + this.selectedSubscription.order_id;
    this._http.post(url, {
          order_id: this.selectedSubscription.order_id,
          custom_duration : this.customFrequency
      }).subscribe((data: any) => {
        if(data.response && data.response.changedRows === 1) {
          this._toastr.showSuccess('Subscription Activated Successfully');
          this.closeModal();
        } else {
					this._toastr.showError('Failed to Activated Subscription, Please try again .');
            this.closeModal();
				 }
      }, (err:any) => {
        this.closeModal();
        this._toastr.showError('Unable to activate subscription. Please try again');
      });
  }


}
