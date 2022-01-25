import { Component, Renderer2, OnInit, ChangeDetectorRef, ViewChild, ViewRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ConsultationService } from '../consultation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { RefundRequestModalComponent } from 'src/app/components/refund-request-modal/refund-request-modal.component';
import { consultationHelper } from 'src/app/services/consultationHelper.service';
import { ChangeAddressModalService } from 'src/app/components/change-address-modal/change-address-modal.service';
import { ChangeAddressModalComponent } from 'src/app/components/change-address-modal/change-address-modal.component';

@Component({
  selector: 'app-consultation-view',
  templateUrl: './consultation-view.component.html',
  styleUrls: ['./consultation-view.component.scss']
})
export class ConsultationViewComponent implements OnInit {
  modalRef!: BsModalRef;

  loading = false;
  consultationId: any;
  consultationDetails: any;
  patient: any;


  initialSymptoms: any;

  triageResponse: any;
  selectedCondition: any;
  selectedConditionId!: string;

  showChangeAddressBtn!:boolean;

  constructor(
    public _helper: Helper,
    private _router: Router,
    private _toastr: Toastr,
    private _http: HttpClient,
    private _renderer: Renderer2,
    public _cdr: ChangeDetectorRef,
    private _activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    public _consultationHelper:consultationHelper,
    private _changeAddressModalService: ChangeAddressModalService,
    private _consultationService: ConsultationService){

    this.consultationId = this._activeRoute.snapshot.paramMap.get('id');
  }


  async ngOnInit(){
    await this.loadConsultationDetails();
  }


  gotoConsultation(consultationID: any) {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`/admin/consultation/view/${consultationID}`])
    });
  }

  gotoPatientDetails() {
    this._router.navigate(['admin', 'patients', 'view', this.consultationDetails.user_id._id, 'orders']);
  }

  async loadConsultationDetails() {
    this.loading = true;
    this.consultationDetails = await this._consultationService.getConsultationDetails(this.consultationId);
    this.patient = this.consultationDetails.user_id;
    this.patient.age = this._helper.calculateAge(this.patient.date_of_birth, 'YYYY-MM-DDTHH:mm:ss.000Z');
    this.loading = false;
    this.showChangeAddressBtn =true;

    if (this.consultationDetails && this.consultationDetails.interview_details){
        this.initialSymptoms = this.consultationDetails.interview_details.parse_response;
    }
  }


  getFileType(extension: string) {
    if (extension == 'pdf') { return `<span class="float-right badge badge-danger p-2">PDF</span>`; }
    else if (extension == 'doc') { return `<span class="float-right badge badge-primary p-2">DOC</span>`; }
    else if (extension == 'docx') { return `<span class="float-right badge badge-primary p-2">DOC</span>`; }
    else if (extension == 'odt') { return `<span class="float-right badge badge-success p-2">ODT</span>`; }
    else {
      return `<span class="float-right badge badge-info p-2">${extension.toUpperCase()}</span>`;;
    }
  }

  getFileSize(_size: number) {
    var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
      i = 0; while (_size > 900) { _size /= 1024; i++; }
    return (Math.round(_size * 100) / 100) + ' ' + fSExt[i];
  }

  getUploadedBy(uploaded_by_id: any) {
    if (uploaded_by_id == this.consultationDetails.user_id._id) { return 'By Patient' }
    else if (uploaded_by_id == this.consultationDetails.doctor_id._id) { return 'By Physician' }
    else { return ''; }
  }

  openDocument(path: string) {
    this._router.navigate([]).then(result => { window.open(`${environment.api_url + path.substring(1)}`, '_blank'); });
  }

  async removeMediaById(id: any){
    let bodyData = {
      media_id: id,
      consultation_id: this.consultationId
    }
    let deleted = await this._consultationService.removeConsultationMediaById(bodyData);
    await this.reloadMedia();
  }

  async reloadMedia(){
    let allMedia: any = await this._consultationService.getConsultationMedia(this.consultationId);
    this.consultationDetails.photos = allMedia.photos;
    this.consultationDetails.documents = allMedia.documents;
    this._cdr.detectChanges();
  }

  viewERx(doesspot_patient_id: number, doesspot_prescription_id: number) {
    this._router.navigate([]).then(result => { window.open(`/admin/prescription/${doesspot_patient_id}/${doesspot_prescription_id}`, '_blank'); });
  }

  async showConditionDetails(conditionId: string, modal: any) {
    this.selectedConditionId = conditionId;
    this.selectedCondition = await this._consultationService.getConditionById(conditionId);
  }

  async downloadReceipt() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    const url = `api/v1/consultation/${this.consultationId}/download`;
    await this._http.get(url, { headers: headers, responseType: 'arraybuffer' }).toPromise().then((result) => {
      let fileName = 'consultation_receipt_' + this.consultationDetails.consultation_number_text + '.pdf';
      this.writeContents(result, fileName, 'application/pdf', true);
    });
  }

  async downloadConsultationSummary() {
    let headers = new HttpHeaders();
    headers.set('Accept', 'application/pdf');
    const url = `api/v1/consultation/download_summary/${this.consultationId}`;
    await this._http.get(url, { headers: headers, responseType: 'arraybuffer' }).toPromise().then((result) => {
      let fileName = 'consultation_summary_' + this.consultationDetails.consultation_number_text + '.pdf';
      this.writeContents(result, fileName, 'application/pdf', false);
    });
  }

  writeContents(content: any, fileName: string, contentType: any, directDownload: boolean = true) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    directDownload ? a.download = fileName : a.setAttribute("target", "_blank");
    a.click();
  }

  openRefundOrderModal() {
    this.modalRef = this.modalService.show(RefundRequestModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((submittedForm: any) => {
      this.refundOrderFormSubmit(submittedForm);
    });
  }


  refundOrderFormSubmit(formValue:any){
    const apiURL = 'api/consultations/refund_request/'+this.consultationId;
    this._http.post(apiURL, formValue).subscribe((data) => {
        this._toastr.showSuccess('Refund request send successfully');
        this.loadConsultationDetails();
      }, err => {
        this._toastr.showError('Unable to send refund request');
      });
  }

  openEditAddressModal(){
    this._changeAddressModalService.setFormData({
      type: 'EDIT_ADDRESS',
      order_id:this.consultationId,
      user_id:this.consultationDetails.user_id._id,
      contact_name:this.consultationDetails.shipping_address.contact_name,
      contact_number:this.consultationDetails.shipping_address.contact_number,
      address_line_1: this.consultationDetails.shipping_address.address_line_1,
      address_line_2: this.consultationDetails.shipping_address.address_line_2?this.consultationDetails.shipping_address.address_line_2:'',
      landmark:this.consultationDetails.shipping_address.landmark,
      city_name: this.consultationDetails.shipping_address.city,
      state_id: this.consultationDetails.shipping_address.state_id,
      state_name: this.consultationDetails.shipping_address.state,
      zip_code: this.consultationDetails.shipping_address.zip_code,
      user_address_type: this.consultationDetails.shipping_address.user_address_type,
      addressModalTitle: 'Change Address'
    });
    this.modalRef = this.modalService.show(ChangeAddressModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((address: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE ADDRESS */
        this.saveUserAddress(address);
    });
  }

  saveUserAddress(address:any){
    const url = 'api/consultations/change_address/' + this.consultationId;
    this._http.post(url,address).subscribe((data:any) => {
        this._toastr.showSuccess('Address Successfully Updated');
        this.loadConsultationDetails();
      }, (err:any) => {
        this._toastr.showError('Unable to update order address. Please try again');
      });
  }

}
