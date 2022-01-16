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
  orderDetails: any;
  drugRXCUI = '';
  userDrugs: any[] = [];
  loadingReminderButton: boolean = false;

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

  }

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

  openRefundOrderModal(){
    this.modalRef = this.modalService.show(RefundRequestModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((formVal: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE ADDRESS */
       this.refundOrderFormSubmit(formVal);
    });
  }

  ngOnInit(){
    this.getOrderDetails();
    this.customFrequency = 30;
  }

  getOrderDetailsAgain(){
    this.getOrderDetails();
  }

  sendMail(orderId:number){
    this.loadingReminderButton = true
    this.http
    .post<any>(`api/orders/email/incompleteOrder/${orderId}`, {})
    .subscribe((response) => {
      this.toastr.showSuccess('Mail has been sent!')
      this.loadingReminderButton = false
    }, (error) => {
      this.toastr.showError('Sorry, Unable to send mail.')
      this.loadingReminderButton = false
    })
  }

  loadMapIframe(){
    this.iframeMapURL = `https://www.google.com/maps/embed/v1/place?key=${environment.google_map_api_key}&q=`;
    this.iframeMapURL += (this.orderDetails.address.address_line_1 !== null ? this.orderDetails.address.address_line_1 : '') + ' ' + (this.orderDetails.address.address_line_2 !== null ? this.orderDetails.address.address_line_2 : '') + ' ' + (this.orderDetails.address.city !== null ? this.orderDetails.address.city : '') + ' ' + (this.orderDetails.address.zip_code !== null ? this.orderDetails.address.zip_code : '')
    this.input.nativeElement.src = this.iframeMapURL;
    this.input.nativeElement.style.display = 'block';
  }

  saveUserAddress(address:any){
    const url = 'api/orders/change_address/' + this.orderId;
    this.http.post(url,address).subscribe((data:any) => {
        this.toastr.showSuccess('Address Successfully Updated');
        this.getOrderDetails();
      }, err => {
        this.toastr.showError('Unable to update order address. Please try again');
      });
  }

  getOrderDetails(){
     const url = 'api/orders/details/' + this.orderId;
     this.http.get(url).subscribe((data: any) => {
        this.orderDetails = data;
        this.patient = data.user_id;
        this.patient.age = this.helper.calculateAge(this.patient.date_of_birth,'YYYY-MM-DDTHH:mm:ss.000Z');
        this.showChangeAddressBtn =true;
        this.getUserLastOrderDrugs()
      },
      err => {
        this.toastr.showError('Unable to fetch order details');
      });
  }

  gotoPatientDetails(){
    this.router.navigate(['admin','patients','view',this.patient._id,'orders']);
  }


  getUserLastOrderDrugs() {
    this.drugRXCUI = '';
    const url = 'api/orders/getUserLastOrderDrugs?user_id=' + this.patient._id;
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
      const url = 'api/subscription/create-refill-order';
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
    const url = 'api/orders/download?order_number=' + this.orderDetails.order_number_text+'&fileType='+type+'&orderId='+this.orderId;
    await this.http.get(url, {headers: headers,  responseType: 'arraybuffer'}).toPromise().then((result) =>{
      let fileName=type=='refund_receipt'?'refund_receipt':'statement';
      fileName+='_order_'+this.orderDetails.order_number_text+'.pdf';
      this.writeContents(result,fileName,'application/pdf');
    });
  }

  async downloadOrderSummary() {
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/pdf');
    const url = `api/orders/download/summary?order_number=${this.orderDetails.order_number_text}&order_id=${this.orderId}`;
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

  refundOrderFormSubmit(formValue:any){
      const apiURL = 'api/orders/refund_request/'+this.orderId;
      this.http.post(apiURL, formValue).subscribe((data) => {
          this.toastr.showSuccess('Refund request send successfully');
          this.getOrderDetails();
        }, err => {
          this.toastr.showError('Unable to send refund request');
        });
  }

}
