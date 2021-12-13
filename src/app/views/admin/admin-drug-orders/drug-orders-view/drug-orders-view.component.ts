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
  profileLicense:any;

  orderDetails: any;
  patientUinqueNumber: any;
  addressForm:FormGroup;
  states:any[]=[];

  iframeMapURL: string = `https://www.google.com/maps/embed/v1/directions`;
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
  ) {
    this.orderId = this.route.snapshot.paramMap.get('id');

    this.getOrderDetails();

    this.addressForm = new FormGroup({
      user_id:new FormControl(null),
      order_id: new FormControl(null),
      address_line_1: new FormControl(null, [Validators.required]),
      address_line_2: new FormControl(null),
      city_name: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      state_name: new FormControl(null, [Validators.required]),
      state_abbreviation: new FormControl(null, [Validators.required]),
      zip_code: new FormControl(null, [Validators.required]),
   });

   this.changeSubscriptionForm=new FormGroup({
    subscription_id:new FormControl(null,[Validators.required]),
    medicine_name:new FormControl(null,[Validators.required]),
    custom_duration:new FormControl(null,[Validators.required])
   });

  }

  get user_id() { return this.addressForm.get('user_id'); }
  get order_id() { return this.addressForm.get('order_id'); }
  get address_line_1() { return this.addressForm.get('address_line_1'); }
  get address_line_2() { return this.addressForm.get('address_line_2'); }
  get city_name() { return this.addressForm.get('city_name'); }
  get state_id() { return this.addressForm.get('state_id'); }
  get state_name() { return this.addressForm.get('state_name'); }
  get state_abbreviation() { return this.addressForm.get('state_abbreviation'); }
  get zip_code() { return this.addressForm.get('zip_code'); }


  get subscription_id () {return this.changeSubscriptionForm.get('subscription_id');}
	get medicine_name () {return this.changeSubscriptionForm.get('medicine_name');}
	get custom_duration () {return this.changeSubscriptionForm.get('custom_duration');}

  closeAddressModal(modal:any){
    this.addressForm.reset();
    modal.hide();
  }

  openEditAddressModal(){
    this.addressForm.patchValue({
      order_id:this.orderId,
      user_id:this.orderDetails.user.id,
      address_line_1: this.orderDetails.address.address_line_1,
      address_line_2: this.orderDetails.address.address_line_2?this.orderDetails.address.address_line_2:'',
      city_name: this.orderDetails.address.city_name,
      state_id: this.orderDetails.address.state_id,
      state_name: this.orderDetails.address.state_name,
      state_abbreviation: this.orderDetails.address.state_abbreviation,
      zip_code: this.orderDetails.address.zip_code
    });
    this.cdr.detectChanges();

 }

  ngOnInit() {
    this._getState();
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
      const apiURL = 'api/v1/drug_orders/refund_request';
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

  _getState() {
    const url = 'api/states/active';
    this.http.get(url).subscribe(
      (data:any) => {
        this.states = data;
      },
      (err) => {
      }
    );
  }


  loadMapIframe () {
    this.iframeMapURL = `https://www.google.com/maps/embed/v1/directions?key=${environment.google_map_api_key}&origin=28.5483592,-81.5886492&destination=`;
    if (this.orderDetails.address.latitude && this.orderDetails.address.longitude) {
      this.iframeMapURL += this.orderDetails.address.latitude + ',' + this.orderDetails.address.longitude;
    } else {
      this.iframeMapURL += (this.orderDetails.address.address_line_1 !== null ? this.orderDetails.address.address_line_1 : '') + ' ' + (this.orderDetails.address.address_line_2 !== null ? this.orderDetails.address.address_line_2 : '') + ' ' + (this.orderDetails.address.city_name !== null ? this.orderDetails.address.city_name : '') + ' ' + (this.orderDetails.address.zip_code !== null ? this.orderDetails.address.zip_code : '')
    }
    this.input.nativeElement.src = this.iframeMapURL;
    this.input.nativeElement.style.display = 'block';
  }

  saveUserAddress(valid:boolean){
    if(valid){
          this.validateShippingAddress().then((res:any) => {
            if (res) {
              const url = 'api/drug_orders/save_order_address';
              this.http.post(url,{
                  order_id:this.orderId,
                  user_id:this.orderDetails.user.id,
                  address:this.addressForm.value
                }).subscribe((data:any) => {

                    this.getOrderDetails();
                },
                (err) => {

                }
              );
           }
        });
    }else{
      return ;
    }
  }


  getStateNameFromId(state_id:number){
    let stateFound =  this.states.find((state:any)=>state.id == state_id);
    return stateFound && stateFound.name ? stateFound.name:'Florida';
  }

  setStateInfo(state_id:any){
    let stateFound =  this.states.find((state:any)=>state.id == state_id);
    this.addressForm.patchValue({
      state_name: stateFound.name,
      state_abbreviation: stateFound.abbreviation
    });
  }


  deactivateSubscription(subscription:any) {
    const url = 'api/drug_orders/cancle_subscription/' + this.orderId;
    let medicine_name=subscription.drug_name+' '+subscription.drug_dosage+' '+subscription.subscription_quantity+' '+subscription.drug_form;
    this.http.post(url, {
      subscription_id:subscription.id,
      medicine_name:medicine_name
    }).subscribe((data:any) => {
        this.toastr.showSuccess('Subscription Deactivated Successfully');
        this.getOrderDetails();
      }, err => {
        this.toastr.showError('Unable to deactivate subscription. Please try again');
      });
  }

  deactivateOTCSubscription(subscription:any){
    const url = 'api/v1/otc-subscription/cancle_subscription/' + subscription.id;
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
      subscription_id:subscription.id,
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
          url = 'api/v1/otc-subscription/activate_subscription/' + this.selectedSubscription.id;
         }else{
          url = 'api/drug_orders/activate_subscription/' + this.orderId;
         }
         message='Subscription Activated';
         error_message='Unable to activate subscription. Please try again';
      }else{
          if(this.ModalDrugType=='OTC'){
            url = 'api/v1/otc-subscription/change_subscription/' + this.selectedSubscription.id;
          }else{
            url = 'api/drug_orders/change_subscription/' + this.orderId;
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
    const url = 'api/drug_orders/info/' + this.orderId;
    const req = '';
    this.http.post(url, req).subscribe((data: any) => {
      this.orderDetails = data;
      this.profileLicense = data.profile_license;
      this.patient = data.user;
      this.patient.age = this.helper.calculateAge(this.patient.date_of_birth,'YYYY-MM-DDTHH:mm:ss.000Z');
      this.patientUinqueNumber = this.helper.getUserUniqueId(this.patient.id, this.patient.type);
      this.anyDrugRefunded = data.drugs.filter((drg:any)=> {
        let is_disabled_refund= (drg.order_drug_status == 'REFUND_PROCESSED' || drg.order_drug_status == 'REFUND_REQUESTED');
        if(!is_disabled_refund) this.all_drugs_for_refund_length++;

        return is_disabled_refund
      }).length>0?true:false;

      console.log('Order Details >> ', this.orderDetails)
      if(data.system_status=='COMPLETED' || data.system_status=='REFUNDED' || data.system_status=='REJECTED'){
        this.showChangeAddressBtn =false;
      }else{
        this.showChangeAddressBtn =true;
      }
      if (this.patient.license_photo) {
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


validateShippingAddress(): Promise<boolean> {

      let state_name= this.getStateNameFromId(this.addressForm.value.state_id);
      let ValidationAddress = {
        address_line1: this.addressForm.value.address_line_1,
        city_locality: this.addressForm.value.city,
        company_name: '',
        country_code: 'US',
        postal_code: this.addressForm.value.zip_code,
        state_province: state_name
      };
      const url = 'api/states/validateShippingAddress';
      let isValid = false;
      const obj = {
        address: [ValidationAddress]
      };
      return new Promise((resolve, reject) => {
        this.http.post(url, obj).subscribe((data: any) => {
            if (data[0].status === 'verified') {
              isValid = true;
              resolve(isValid);
            } else if (data[0].status === 'unverified') {
              isValid = false;
              this.toastr.showError('Shipping Address is not verified');
              reject(isValid);
            } else {
              isValid = false;
              this.toastr.showError('Shipping Address is invalid');
              reject(isValid);
            }
          },
          err => {
            isValid = false;
            this.toastr.showError('Shipping Address is invalid');
            reject(isValid);
          });
      });
  }

  gotoPatientDetails(){
    this.router.navigate(['admin','patients','view',this.patient.id,'orders']);
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
    const url = 'api/drug_orders/get_active_subscriptions/'+this.orderDetails.user.id;
      this.http.get(url).subscribe((data:any) => {
        this.userSubscriptions = data;
      },
      (err) => {
      });
  }

  _getActiveOTCDrugSubscriptionsForUser(){
    const url = 'api/otc-drugs-subscriptions/active_subscriptions/'+this.orderDetails.user.id;
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
        let indexFound= this.selectedOTCSubscriptions.findIndex((item:any)=>item.id == subscription.id);
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
      let indexFound= this.selectedSubscriptions.findIndex((item:any)=>item.id == subscription.id);
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
      let indexFound= this.selectedOTCSubscriptions.findIndex((item:any)=>item.id == subscription_id);
      return indexFound == -1 ? false:true;
    }else{
      let indexFound= this.selectedSubscriptions.findIndex((item:any)=>item.id == subscription_id);
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
       reqBodyItem.user_id = this.orderDetails.user.id;
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
    const url = 'api/v1/drug_orders/download?order_number=' + this.orderDetails.order_number_text+'&fileType='+type+'&orderId='+this.orderId;
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
