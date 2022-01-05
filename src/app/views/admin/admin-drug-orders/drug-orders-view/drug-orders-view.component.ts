import { Component, OnInit, OnDestroy,ChangeDetectorRef,ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lightbox } from 'ngx-lightbox';
import * as moment from 'moment';
import { Helper } from 'src/app/services/helper.service';
import b64toBlob from 'b64-to-blob';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {environment} from 'src/environments/environment'
import {drugOrderHelper} from 'src/app/services/drugOrderHelper.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { RefundDrugModalComponent } from '../../common-components/refund-drug-modal/refund-drug-modal.component';
import { RefundDrugModalService } from '../../common-components/refund-drug-modal/refund-drug-modal.service';

import { ChangeAddressModalComponent } from 'src/app/components/change-address-modal/change-address-modal.component';
import { ChangeAddressModalService } from 'src/app/components/change-address-modal/change-address-modal.service';

@Component({
  selector: 'app-drug-orders-view',
  templateUrl: './drug-orders-view.component.html',
  styleUrls: ['./drug-orders-view.component.scss']
})
export class DrugOrdersViewComponent implements OnInit,OnDestroy {
  modalRef!: BsModalRef;
  orderId: any;
  parentSub: any;
  patient: any;
  orderDetails: any;

  iframeMapURL: string = `https://www.google.com/maps/embed/v1/place`;
  @ViewChild('mapIframe') input: any;
  imageUrl: any = '../../../../assets/img/no-image.png';
  _albums = [{
    src: this.imageUrl,
    caption: 'License image',
    thumb: this.imageUrl
  }];
  showChangeAddressBtn:boolean=false;

  selectedSubscription:any ;
  ModalLabel='';
  ModalEvent='';
  ModalDrugType='';
  changeSubscriptionForm:FormGroup;
  formSubmitting:boolean=false;
  customFrequency: number=30;
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

  userSubscriptions:any[]=[];
  userOTCSubscriptions:any[]=[];
  loadingCreateRefillOrder:boolean=false;
  selectedSubscriptions:any[]=[];
  selectedOTCSubscriptions:any[]=[];

  refillOrderTotal:number=0;
  anyDrugRefunded: boolean = false;
  all_drugs_for_refund_length = 0;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private toastr: Toastr,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private lightbox: Lightbox,
    public helper: Helper,
    public cdr: ChangeDetectorRef,
    public _drugOrderHelper:drugOrderHelper,
    private modalService: BsModalService,
    private _refundDrugModalService: RefundDrugModalService,
    private _changeAddressModalService:ChangeAddressModalService){

    this.orderId = this.route.snapshot.paramMap.get('id');
    this.getOrderDetails();
    this.changeSubscriptionForm=new FormGroup({
        subscription_id:new FormControl(null,[Validators.required]),
        medicine_name:new FormControl(null,[Validators.required]),
        custom_duration:new FormControl(null,[Validators.required])
    });
  }

  get subscription_id () {return this.changeSubscriptionForm.get('subscription_id');}
	get medicine_name () {return this.changeSubscriptionForm.get('medicine_name');}
	get custom_duration () {return this.changeSubscriptionForm.get('custom_duration');}


  openEditAddressModal(){
    this._changeAddressModalService.setFormData({
      type: 'EDIT_ADDRESS',
      order_id:this.orderId,
      user_id:this.orderDetails.user_id._id,
      contact_name:this.orderDetails.shipping_address.contact_name,
      contact_number:this.orderDetails.shipping_address.contact_number,
      address_line_1: this.orderDetails.shipping_address.address_line_1,
      address_line_2: this.orderDetails.shipping_address.address_line_2?this.orderDetails.shipping_address.address_line_2:'',
      landmark:this.orderDetails.shipping_address.landmark,
      city_name: this.orderDetails.shipping_address.city,
      state_id: this.orderDetails.shipping_address.state_id,
      state_name: this.orderDetails.shipping_address.state,
      zip_code: this.orderDetails.shipping_address.zip_code,
      user_address_type: this.orderDetails.shipping_address.user_address_type,
      addressModalTitle: 'Change Address'
    });
    this.modalRef = this.modalService.show(ChangeAddressModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((address: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE ADDRESS */
        this.saveUserAddress(address);
    });
  }

  ngOnInit(){
  }

  openRefundModal(){
    this._refundDrugModalService.setData({
      order: this.orderDetails,
      all_drugs_for_refund_length: this.all_drugs_for_refund_length
    })
    this.modalRef = this.modalService.show(RefundDrugModalComponent)
    this.modalRef.content.onEventCompleted.subscribe((refundOrderForm: any) => {
      this.refundOrderFormSubmit(refundOrderForm)
    })
  }

  refundOrderFormSubmit(form:any) {
    if(form.valid){
      // this.drugorderDetailsLoader.start();
      this.formSubmitting = true;
      const apiURL = 'api/pharmacy_orders/refund_request/'+this.orderId;
      const obj = {
        initiated_by: 'admin',
        order_id: this.orderId,
        selected_drug_ids:form.value.selected_drug_ids,
        refund_reason:form.value.refund_reason
      };
      this.http.post(apiURL, obj).subscribe((data:any) => {
          // this.drugorderDetailsLoader.stop();
          this.formSubmitting = false;
          this.toastr.showSuccess('Refund request send successfully');
          this.getOrderDetails();
        },(err:any) => {
          // this.drugorderDetailsLoader.stop();
          this.formSubmitting = false;
          this.toastr.showError('Unable to send refund request');
        });
      return true;
    }else{
      return false;
    }
  }

  loadMapIframe(){
    this.iframeMapURL = `https://www.google.com/maps/embed/v1/place?key=${environment.google_map_api_key}&q=`
    this.iframeMapURL += (this.orderDetails.shipping_address.address_line_1 !== null ? this.orderDetails.shipping_address.address_line_1 : '') + ' ' + (this.orderDetails.address.address_line_2 !== null ? this.orderDetails.address.address_line_2 : '') + ' ' + (this.orderDetails.address.city !== null ? this.orderDetails.address.city : '') + ' ' + (this.orderDetails.address.zip_code !== null ? this.orderDetails.address.zip_code : '')
    this.input.nativeElement.src = this.iframeMapURL;
    this.input.nativeElement.style.display = 'block';
  }

  saveUserAddress(address:any){
    const url = 'api/pharmacy_orders/change_address/' + this.orderId;
    this.http.post(url,address).subscribe((data:any) => {
        this.toastr.showSuccess('Address Successfully Updated');
        this.getOrderDetails();
      }, err => {
        this.toastr.showError('Unable to update order address. Please try again');
      });
  }

  deactivateSubscription(subscription:any) {
    const url = 'api/pharmacy_orders/cancle_subscription/' + this.orderId;
    let medicine_name=subscription.drug_name+' '+subscription.drug_dosage+' '+subscription.subscription_quantity+' '+subscription.drug_form;
    this.http.post(url, {
      subscription_id:subscription._id,
      medicine_name:medicine_name
    }).subscribe((data:any) => {
        this.toastr.showSuccess('Subscription Deactivated Successfully');
        this.getOrderDetails();
      }, err => {
        this.toastr.showError('Unable to deactivate subscription. Please try again');
      });
  }

  deactivateOTCSubscription(subscription:any){
    const url = 'api/v1/otc-subscription/cancle_subscription/' + subscription._id;
    this.http.post(url,{}).subscribe((data:any) => {
        this.toastr.showSuccess('Subscription Deactivated Successfully');
        this.getOrderDetails();
      }, err => {
        this.toastr.showError('Unable to deactivate subscription. Please try again');
      });
  }

  openModal(subscription:any,event:string,drugType:string){
    this.ModalEvent = event;
    this.ModalLabel = event=='ACTIVATE'?'Activate Subscription':'Subscription Settings';
    this.ModalDrugType = drugType;
    this.selectedSubscription=subscription;

    let medicine_name='';
    if(drugType=='OTC'){
      medicine_name = subscription.otc_drug_name;
    }else{
      medicine_name = subscription.drug_name+' '+subscription.drug_dosage+' '+subscription.subscription_quantity+' '+subscription.drug_form;
    }

    this.selectedSubscription.medicine_name = medicine_name;
    this.changeSubscriptionForm.patchValue({
      subscription_id:subscription._id,
      medicine_name:medicine_name
    });

  }

  closeModal(modal:any){
    modal.hide();
    this.ModalEvent='';
    this.ModalLabel='';
    this.ModalDrugType = '';
    this.selectedSubscription=null;
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
         if(this.ModalDrugType=='OTC'){
          url = 'api/v1/otc-subscription/activate_subscription/' + this.selectedSubscription._id;
         }else{
          url = 'api/pharmacy_orders/activate_subscription/' + this.orderId;
         }
         message='Subscription Activated';
         error_message='Unable to activate subscription. Please try again';
      }else{
          if(this.ModalDrugType=='OTC'){
            url = 'api/v1/otc-subscription/change_subscription/' + this.selectedSubscription._id;
          }else{
            url = 'api/pharmacy_orders/change_subscription/' + this.orderId;
          }
         message='Subscription Changed';
         error_message='Unable to change subscription. Please try again';
      }

      this.http.post(url,formVal).subscribe((data: any) => {

        this.changeSubscriptionForm.reset();
        this.toastr.showSuccess(message);
        this.formSubmitting= false;
        this.getOrderDetails();
      },err => {

        this.changeSubscriptionForm.reset();
        this.formSubmitting= false;
        this.toastr.showError(error_message);
      });
    }else{
      return ;
    }
  }

  getOrderDetails() {
    const url = 'api/pharmacy_orders/details/' + this.orderId;

    this.http.get(url).subscribe((data: any) => {
      this.orderDetails = data;
      this.patient = data.user_id;
      this.patient.age = this.helper.calculateAge(this.patient.date_of_birth,'YYYY-MM-DDTHH:mm:ss.000Z');
      this.anyDrugRefunded = data.products.filter((drg:any)=> {
        let is_disabled_refund= (drg.order_drug_status == 'REFUND_PROCESSED' || drg.order_drug_status == 'REFUND_REQUESTED');
        if(!is_disabled_refund) this.all_drugs_for_refund_length++;

        return is_disabled_refund
      }).length>0?true:false;

      if(data.system_status=='COMPLETED' || data.system_status=='REFUNDED' || data.system_status=='REJECTED'){
        this.showChangeAddressBtn =false;
      }else{
        this.showChangeAddressBtn =true;
      }

      if (this.patient.license_photo){
        this.getImage(this.patient.license_photo);
      } else {
        this.imageUrl = '../../../../assets/img/no-image.png';
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'License image',
          thumb: this.imageUrl
        });
      }
      this._getActiveSubscriptionsForUser();
    },
      err => {
        this.toastr.showError('Unable to fetch order detials');
      });
  }

  gotoPatientDetails(){
    this.router.navigate(['admin','patients','view',this.patient._id,'orders']);
  }

  async getImage(path: string) {
    await this.http.post('api/document/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
      const fr = new FileReader();
      fr.readAsDataURL(result);
      fr.onloadend = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(fr.result + '');
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'License image',
          thumb: this.imageUrl
        });
      }
    })
      .catch(err => {
        this.imageUrl = '../../../../assets/img/no-image.png';
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'License image',
          thumb: this.imageUrl
        });
      })
  }

  open(): void {
    this.lightbox.open(this._albums, 0, { centerVertically: true });
  }

  ngOnDestroy() {
    if (this.parentSub) {
      this.parentSub.unsubscribe();
    }
  }

  openShippingLabelToPrint(label_url:any) {
    if (label_url) {
      const b64Data = label_url.split(',')[1];
      const contentType = 'application/pdf';
      const blob = b64toBlob(b64Data, contentType);
      const url = URL.createObjectURL(blob);
      let pdfWindow:any = window.open('', '_blank');
      pdfWindow.document.write(`<iframe id="shippingLabel" src="${url}" height="100%" width="100%"></iframe>`);
      pdfWindow.document.close();
      setTimeout(() => {
        pdfWindow.frames['shippingLabel'].contentWindow.print();
      }, 1000);
    }
  }

  /*---------------------------------------------------------------------------- */
  /*------------------------ CREATE REFILL ORDER FUNCTIONS  ------------------------  */
  /*---------------------------------------------------------------------------- */


  _getActiveSubscriptionsForUser(){
    const url = 'api/pharmacy_orders/get_active_subscriptions/'+this.orderDetails.user_id._id;
      this.http.get(url).subscribe((data:any) => {
        this.userSubscriptions = data;
      },
      (err) => {
      });
  }

  _getActiveOTCDrugSubscriptionsForUser(){
    const url = 'api/otc-drugs-subscriptions/active_subscriptions/'+this.orderDetails.user_id._id;
      this.http.get(url).subscribe((data:any) => {
        this.userOTCSubscriptions = data;
      },
      (err) => {
      });
  }

  openCreateRefillOrderModal(){
    this._getActiveSubscriptionsForUser();
    this._getActiveOTCDrugSubscriptionsForUser();

  }

  closeCreateRefillOrderModal(modal:any){
    modal.hide();
    this.selectedSubscriptions = [];
    this.selectedOTCSubscriptions = [];
  }

  handleChangeSubscription(checked:boolean,subscription:any,drug_type:string){
    if(drug_type=='OTC'){
        let indexFound= this.selectedOTCSubscriptions.findIndex((item:any)=>item._id == subscription._id);
        if(checked){
          if(indexFound==-1){
            this.selectedOTCSubscriptions.push(subscription);
          }
        }else{
          if(indexFound!=-1){
            this.selectedOTCSubscriptions.splice(indexFound,1);
          }
        }
    }else{
      let indexFound= this.selectedSubscriptions.findIndex((item:any)=>item._id == subscription._id);
      if(checked){
         if(indexFound==-1){
          this.selectedSubscriptions.push(subscription);
         }
      }else{
        if(indexFound!=-1){
          this.selectedSubscriptions.splice(indexFound,1);
        }
      }
    }

    this.calculateTotalForRefillOrder();
    this.cdr.detectChanges();
  }

  checkItemSelected(subscription_id:number,drug_type:string){
    if(drug_type=='OTC'){
      let indexFound= this.selectedOTCSubscriptions.findIndex((item:any)=>item._id == subscription_id);
      return indexFound == -1 ? false:true;
    }else{
      let indexFound= this.selectedSubscriptions.findIndex((item:any)=>item._id == subscription_id);
      return indexFound == -1 ? false:true;
    }
  }

  calculateTotalForRefillOrder(){
    let total = 0;
    for(let item of this.selectedSubscriptions){
        total+=item.subscription_price;
    }
    for(let item of this.selectedOTCSubscriptions){
        total+=item.subscription_price_total;
    }
    this.refillOrderTotal = total;
    this.refillOrderTotal = Math.round(this.refillOrderTotal*100)/100;
  }


  handleSubmitCreateRefillOrderForm(){
    if(this.selectedSubscriptions.length>0 || this.selectedOTCSubscriptions.length>0){
       let reqBody=[];
       let reqBodyItem:any={};
       reqBodyItem.user_id = this.orderDetails.user_id._id;
       reqBodyItem.subscriptions = this.selectedSubscriptions;
       reqBodyItem.otc_subscriptions = this.selectedOTCSubscriptions;
       reqBody.push(reqBodyItem);
       this.callAPItoCreateRefillOrder(reqBody);
    }else{
      return ;
    }
  }

  callAPItoCreateRefillOrder(data:any){
    this.loadingCreateRefillOrder = true;
      const url = 'app/handle_drug_order';
      this.http.post(url,{orders:data}).subscribe((res: any) => {
      this.loadingCreateRefillOrder = false;
      this.toastr.showSuccess('Refill Order Successfully Created');

      this.getOrderDetails();
    },
      err => {
        this.loadingCreateRefillOrder = false;
        this.toastr.showError(err.message);
    });
  }

  /*---------------------------------------------------------------------------- */
  /*------------------------ DOWNLOAD BILLING STATEMENT FUNCTIONS  ------------------------  */
  /*---------------------------------------------------------------------------- */

  async downloadReceipt(type:string){
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    const url = 'api/pharmacy_orders/download?order_number=' + this.orderDetails.order_number_text+'&fileType='+type+'&orderId='+this.orderId;
    await this.http.get(url, {headers: headers,  responseType: 'arraybuffer'  }).toPromise().then((result) =>{
      let fileName=type=='refund_receipt'?'refund_receipt':'statement';
      fileName+='_order_'+this.orderDetails.order_number_text+'.pdf';
      this.writeContents(result,fileName,'application/pdf');
    });
  }

  writeContents(content:any, fileName:string, contentType:any) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

}
