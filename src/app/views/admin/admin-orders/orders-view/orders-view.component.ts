import { Component, OnInit, ChangeDetectorRef,ViewChild } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Toastr } from '../../../../services/toastr.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lightbox } from 'ngx-lightbox';
import b64toBlob from 'b64-to-blob';

import { Helper } from '../../../../services/helper.service';
import {environment} from '../../../../../environments/environment'
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { orderHelper } from 'src/app/services/orderHelper.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChangeAddressModalComponent } from 'src/app/components/change-address-modal/change-address-modal.component';
import { ChangeAddressModalService } from 'src/app/components/change-address-modal/change-address-modal.service';
import { RefundRequestModalComponent } from 'src/app/components/refund-request-modal/refund-request-modal.component';

@Component({
  selector: 'app-orders-view',
  templateUrl: './orders-view.component.html',
  styleUrls: ['./orders-view.component.scss']
})
export class OrdersViewComponent implements OnInit {
  modalRef!: BsModalRef;
  orderId: any;
  parentSub: any;
  patient: any;
  profileLicense: any;
  orderDetails: any;
  patientUinqueNumber: any;
  drugRXCUI = '';
  userDrugs: any[] = [];
  orderCurrentStatus: any = {};
  loadingReminderButton: boolean = false;
  states:any[]=[];

  refundData: any;
  refundOrderForm:FormGroup;
  formSubmitting:boolean=false;

  iframeMapURL: string = `https://www.google.com/maps/embed/v1/directions`;
  @ViewChild('mapIframe') input: any;
  imageUrl: any = '../../../../assets/img/no-image.png';
  _albums = [{
    src: this.imageUrl,
    caption: 'License image',
    thumb: this.imageUrl
  }];

  customFrequency!: number;
  customFrequencyOptions = [7, 15, 30, 45, 60, 75, 90,120];
  showChangeAddressBtn!:boolean;
  loadingCreateRefillOrderButton!:boolean;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private toastr: Toastr,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private lightbox: Lightbox,
    public helper: Helper,
    public cdr: ChangeDetectorRef,
    private modalService: BsModalService,
    public _orderHelper:orderHelper,
    private _changeAddressModalService: ChangeAddressModalService,
  ) {
    this.orderId = this.route.snapshot.paramMap.get('id');

    this.refundOrderForm = new FormGroup({
      refund_reason:new FormControl(null, [Validators.required])
    });
  }

  get refund_reason(){return this.refundOrderForm.get('refund_reason');}

  openEditAddressModal(){
    this._changeAddressModalService.setFormData({
      type: 'EDIT_ADDRESS',
      order_id:this.orderId,
      user_id:this.orderDetails.user.id,
      address_line_1: this.orderDetails.address.address_line_1,
      address_line_2: this.orderDetails.address.address_line_2?this.orderDetails.address.address_line_2:'',
      city_name: this.orderDetails.address.city_name,
      state_id: this.orderDetails.address.state_id,
      state_name: this.orderDetails.address.state_name,
      state_abbreviation: this.orderDetails.address.state_abbreviation,
      zip_code: this.orderDetails.address.zip_code,
      addressModalTitle: 'Change Address'
    });
    this.modalRef = this.modalService.show(ChangeAddressModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((file: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE ADDRESS */
    });
  }

  openRefundOrderModal(){
    this.modalRef = this.modalService.show(RefundRequestModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((submittedForm: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE ADDRESS */
    });
  }

  ngOnInit() {
    this.getOrderDetails();
    this._getState();

    //this.getPatientDetails();
    this.customFrequency =30;
  }

  getOrderDetailsAgain(){
    this.getOrderDetails();
  }

  _getState() {
    const url = 'api/system_states/all';
    this.http.get(url).subscribe(
      (data:any) => {
        this.states = data;
      },
      (err) => {
      }
    );
  }
  sendMail(orderId:number) {
    this.loadingReminderButton = true
    this.http
    .post<any>(`api/v1/admin/orders/email/incompleteOrder/${orderId}`, {})
    .subscribe((response) => {
      this.toastr.showSuccess('Mail has been sent!')
      this.loadingReminderButton = false
    }, (error) => {
      this.toastr.showError('Sorry, Unable to send mail.')
      this.loadingReminderButton = false
    })
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

  getOrderCreatedWay(data:any){
    let badge='';
    switch (data) {
      case 'MANUAL_BY_USER':
        badge= `<span class='p-2 badge badge-pill badge-info'>Manually By Customer</span>`;
        break;
      case 'MANUAL_BY_STAFF':
        badge= `<span class='p-2 badge badge-pill badge-warning'>Manually By Staff</span>`;
        break;
      case 'AUTO_BY_SYSTEM':
        badge= `<span class='p-2 badge badge-pill badge-dark'>Auto By System</span>`;
        break;
    }
    return badge;
  }

  saveUserAddress(valid:boolean,modal:any){
    if(valid){
          this.validateShippingAddress().then((res:any) => {
            if (res) {
              const url = 'api/v1/technician/save_order_address';
              this.http.post(url,{
                  order_id:this.orderId,
                  user_id:this.orderDetails.user.id,
                  // address:this.addressForm.value
                }).subscribe((data:any) => {
                    modal.hide();
                    this.getOrderDetails();
                },
                (err) => {

                }
              );
          }
        });
    }else{
      return;
    }
}

getStateNameFromId(state_id:number){
  let stateFound =  this.states.find((state:any)=>state.id == state_id);
  return stateFound && stateFound.name ? stateFound.name:'Florida';
}

setStateInfo(state_id:any){
  let stateFound =  this.states.find((state:any)=>state.id == state_id);
  /* this.addressForm.patchValue({
    state_name: stateFound.name,
    state_abbreviation: stateFound.abbreviation
  }); */
}

validateShippingAddress(): Promise<boolean> {
  // let state_name= this.getStateNameFromId(this.addressForm.value.state_id);
  let ValidationAddress = {
    // address_line1: this.addressForm.value.address_line_1,
    // city_locality: this.addressForm.value.city,
    company_name: '',
    country_code: 'US',
    //postal_code: this.addressForm.value.zip_code,
    //state_province: state_name
  };
  const url = 'api/v1/admin/states/validateShippingAddress';
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

  getOrderDetails() {
    const url = 'api/v1/admin/orders/info/' + this.orderId;
    const req = '';
    this.http.post(url, req).subscribe((data: any) => {
      this.orderDetails = data;
      this.getOrderCurrentStatus();
      this.patient = data.user;
      this.profileLicense = data.profile_license;
      this.patient.age = this.helper.calculateAge(this.patient.date_of_birth,'YYYY-MM-DDTHH:mm:ss.000Z');
      this.patientUinqueNumber = this.helper.getUserUniqueId(this.patient.id, this.patient.type);
      if(data.system_status ==10 || data.system_status ==11 || data.system_status ==13 || data.system_status ==14 || data.system_status ==15 || data.system_status ==17){
        this.showChangeAddressBtn =false;
      }else{
        this.showChangeAddressBtn =true;
      }
      
      this.getUserLastOrderDrugs()
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

    },
      err => {
        this.toastr.showError('Unable to fetch order detials');
      });
  }

  gotoPatientDetails(){
    this.router.navigate(['admin','patients','view',this.patient.id,'orders']);
  }

  getOrderCurrentStatus() {
    const url = 'api/v1/admin/orders/status/' + this.orderId;
    this.http.get(url).subscribe((data: any) => {
      this.orderCurrentStatus = data;
    });
  }

  getUserLastOrderDrugs() {
    this.drugRXCUI = '';
    const url = 'api/v1/new_orders/getUserLastOrderDrugs?user_id=' + this.patient.id;
    this.http.post(url, {}).subscribe(
      (data: any) => {
        this.userDrugs = data;
        this.userDrugs.forEach(drug => {
          this.drugRXCUI += drug.rxcui + ' ';
        });
        this.cdr.detectChanges();
      },
      err => {

      }
    );
  }
  async getImage(path: string) {
    await this.http.post('api/v1/admin/document/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
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
        //
      })
  }
  open(): void {
    this.lightbox.open(this._albums, 0, { centerVertically: true });
  }

  OnDestroy() {
    if (this.parentSub) {
      this.parentSub.unsubscribe();
    }
  }


  openShippingLabelToPrint(label_url: any) {
    if (label_url) {
      const b64Data = label_url.split(',')[1];
      const contentType = 'application/pdf';
      const blob = b64toBlob(b64Data, contentType);
      const url = URL.createObjectURL(blob);
      const pdfWindow: any = window.open('', '_blank');
      pdfWindow.document.write(`<iframe id="shippingLabel" src="${url}" height="100%" width="100%"></iframe>`);
      pdfWindow.document.close();
      setTimeout(() => {
        // pdfWindow.location.href = url;
        pdfWindow.frames['shippingLabel'].contentWindow.print();
      }, 1000);
    }
  }

  changeCustomFrequency(value: any) {
    this.customFrequency = value;
  }

  getPrescriptionUrl(prescriptionUrl:string){
    let openRXUrl=environment.api_url+prescriptionUrl;
    window.open(openRXUrl, '_blank');
  }

  createRefillOrder(orderId:number){
    this.loadingCreateRefillOrderButton = true;
      const url = 'api/v1/admin/subscription/create-refill-order';
      this.http.post(url,{orders:[this.orderDetails.id]}).subscribe((data: any) => {
      this.loadingCreateRefillOrderButton = false;
      this.toastr.showSuccess('Refill Order Successfully Created');
    },
      err => {
        this.loadingCreateRefillOrderButton = false;
        this.toastr.showError(err.message);
    });
  }

  async downloadReceipt(type:string){
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    const url = 'api/v1/new_orders/download?order_number=' + this.orderDetails.order_number_text+'&fileType='+type+'&orderId='+this.orderId;
    await this.http.get(url, {headers: headers,  responseType: 'arraybuffer'}).toPromise().then((result) =>{
      let fileName=type=='refund_receipt'?'refund_receipt':'statement';
      fileName+='_order_'+this.orderDetails.order_number_text+'.pdf';
      this.writeContents(result,fileName,'application/pdf');
    });
  }

  async downloadOrderSummary() {
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/pdf');
    const url = `api/v1/new_orders/download/summary?order_number=${this.orderDetails.order_number_text}&order_id=${this.orderId}`;
    await this.http.get(url, { headers: headers, responseType: 'arraybuffer' }).toPromise().then((result) =>{
      let fileName='order_summary_'+this.orderDetails.order_number_text+'.pdf';
      this.writeContents(result,fileName,'application/pdf', false);
    });
  }

  writeContents(content:any, fileName:string, contentType:any, directDownload: boolean = true) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    directDownload ? a.download = fileName : a.setAttribute("target", "_blank");
    a.click();
  }

  refundOrderFormSubmit(formValid:boolean,modal:any) {
    if(formValid){
      this.formSubmitting = true;
      const apiURL = 'api/v1/new_orders/refund';
      const obj = {
        initiated_by: 'admin',
        order_id: this.orderId,
        refund_reason:this.refundOrderForm.value.refund_reason
      };

      this.http.post(apiURL, obj)
        .subscribe((data) => {
          this.formSubmitting = false;
          this.refundData = data;
          document.getElementById('hiderefundOrderModal')?.click();
          this.toastr.showSuccess('Refund request send successfully');
          this.getOrderDetails();
          this.cdr.detectChanges();
        }, err => {
          this.formSubmitting = false;
          document.getElementById('hiderefundOrderModal')?.click();
          this.toastr.showError('Unable to send refund request');
        });
    }else{
      return;
    }
  }

}
