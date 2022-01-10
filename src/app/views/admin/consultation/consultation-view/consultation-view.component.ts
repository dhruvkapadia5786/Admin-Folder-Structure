import { Component, Renderer2, OnInit, ChangeDetectorRef, ViewChild, ViewRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ConsultationService } from '../consultation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
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

  followupSymptoms: any;

  drugsTaken: any = [];
  initialSymptoms: any;
  presentRiskFactors: any;
  allRiskFactors: any;

  diagnosisQuestions: any;
  diagnosisFinalConditions: any;
  diagnosisFinalConditionsFormatted: any;

  diagnosisFinalBody: any;
  questionsAndAnswers: any[] = [];

  healthQueAndAnswers!: Array<any>;
  redChoiceAnswer: any = [];
  redChoiceAnswerIds: any = [];
  greenChioceAnswer: any = [];
  yellowChoiceAnswer: any = [];

  triageResponse: any;

  patientUinqueNumber: any;

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
    this.loadRiskFactors();
    await this.loadConsultationDetails();
  }


  gotoConsultation(consultationID: any) {
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`/admin/consultation/view/${consultationID}`])
    });
  }

  async loadRiskFactors() {
    this.allRiskFactors = await this._consultationService.loadRiskFactors();
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

    this._getQuestions();

    if (this.consultationDetails && this.consultationDetails.consultation_type == 'NEW' && this.consultationDetails.details) {
      this.drugsTaken = this.consultationDetails.details.drugs_taken ? JSON.parse(this.consultationDetails.details.drugs_taken) : [];
      this.initialSymptoms = JSON.parse(this.consultationDetails.details.parse_response);
      this.presentRiskFactors = this.consultationDetails.details.risk_factors ? JSON.parse(this.consultationDetails.details.risk_factors) : [];

      if (this.presentRiskFactors && this.presentRiskFactors.length > 0 && this.allRiskFactors.length > 0) {
        this.presentRiskFactors.map((prf: any) => {
          let found = this.allRiskFactors.find((rskF: any) => { return rskF.id == prf.id });
          if (found) {
            prf.common_name = found.common_name;
            return prf;
          }
        });
      }

      this.diagnosisQuestions = JSON.parse(this.consultationDetails.details.diagnosis_questions);
      this.diagnosisFinalBody = JSON.parse(this.consultationDetails.details.diagnosis_final_body);
      this.triageResponse = this.consultationDetails.details.triage_response ? JSON.parse(this.consultationDetails.details.triage_response) : null;

      this.questionsAndAnswers = this.findAnswerFromQuestion();
      if (this.diagnosisQuestions[this.diagnosisQuestions.length - 1] && this.diagnosisQuestions[this.diagnosisQuestions.length - 1]['should_stop']) {
        this.diagnosisFinalConditions = this.diagnosisQuestions[this.diagnosisQuestions.length - 1]['conditions'];
        let onlyIds = this.diagnosisFinalConditions.map((cnd: any) => cnd.id);
        this.diagnosisFinalConditionsFormatted = await this.getMultipleConditionsDetails(onlyIds.join(','));
      }
    }

    if (this.consultationDetails && this.consultationDetails.consultation_type == 'FOLLOWUP' && this.consultationDetails.details) {
      this.followupSymptoms = this.consultationDetails.details.followup_input ? JSON.parse(this.consultationDetails.details.followup_input) : [];
    }
  }

  async getMultipleConditionsDetails(condition_ids: any) {
    let result: any = await this._consultationService.getMultipleConditions(condition_ids);
    result.map((res: any) => {
      let objFound = this.diagnosisFinalConditions.find((obj: any) => obj.id == res.id);
      if (objFound) { res.probability = objFound.probability; return objFound; }
    });
    return result;
  }

  _getQuestions() {
    const url = `api/v1/consultation/answer/${this.consultationId}`;
    this._http.get(url).subscribe((data: any) => {
      this.healthQueAndAnswers = data;
      let filteredSubQuestions = this.healthQueAndAnswers.filter(q => { return q.type == 'SUB' });
      this.healthQueAndAnswers = this.healthQueAndAnswers.filter(q => q.type == 'MAIN');
      this.healthQueAndAnswers = JSON.parse(JSON.stringify(this.healthQueAndAnswers));
      this.healthQueAndAnswers.map(q => {
        q.sub_questions = filteredSubQuestions.filter(fq => fq.parent_question_id == q._id);
        return q;
      });

      this.redChoiceAnswer = [];
      this.yellowChoiceAnswer = [];
      this.greenChioceAnswer = [];
      this.healthQueAndAnswers.forEach((question: any) => {
        if (parseInt(question.choices[0].result, 10) == 1) {
          this.redChoiceAnswer.push(question);
          this.redChoiceAnswerIds.push(question['user_answer_id']);
        } else if (parseInt(question.choices[0].result, 10) == 2) {
          this.greenChioceAnswer.push(question);
        } else if (parseInt(question.choices[0].result, 10) == 3) {
          this.yellowChoiceAnswer.push(question);
        }
      });
      this.healthQueAndAnswers = [];
      this.healthQueAndAnswers = this.healthQueAndAnswers.concat(this.redChoiceAnswer, this.yellowChoiceAnswer, this.greenChioceAnswer);
    }, err => {

    });
  }


  findAnswerFromQuestion() {
    let questionsAndAnswers: any = [];
    if (this.diagnosisQuestions && this.diagnosisQuestions.length > 0) {
      this.diagnosisQuestions.forEach((dQ: any) => {
        let QnA: any = {
          type: dQ.question.type,
          question: dQ.question.text,
          answer: []
        };
        dQ.question.items.forEach((item: any) => {
          let filteredChoises = this.diagnosisFinalBody.evidence.filter((ev: any) => { return item.id == ev.id });
          filteredChoises.forEach((fc: any) => {
            let foundChoise: any = item.choices.find((cho: any) => { return cho.id == fc.choice_id });
            if (dQ.question.type == 'single') {
              foundChoise.choise_text = foundChoise.label;
            } else if (dQ.question.type == 'group_single') {
              foundChoise.choise_text = item.name;
            } else {
              foundChoise.choise_text = item.name + ' - ' + foundChoise.label;
            }
            QnA.answer.push(foundChoise);
          });
        });
        questionsAndAnswers.push(QnA);
      });
      return questionsAndAnswers;
    } else {
      return [];
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

  getUploadedBy(uploaded_by_id: number) {
    if (uploaded_by_id == this.consultationDetails.user_id._id) { return 'By Patient' }
    else if (uploaded_by_id == this.consultationDetails.doctor_id._id) { return 'By Physician' }
    else { return ''; }
  }

  openDocument(path: string) {
    this._router.navigate([]).then(result => { window.open(`${environment.api_url + path.substring(1)}`, '_blank'); });
  }

  async removeMediaById(id: any) {
    let bodyData = {
      media_id: id,
      consultation_id: this.consultationId
    }
    let deleted = await this._consultationService.removeConsultationMediaById(bodyData);
    await this.reloadMedia();
  }

  async reloadMedia(){
    let allMedia: any = await this._consultationService.getConsultationMedia(this.consultationId);
    this.consultationDetails.media = allMedia.media;
    this.consultationDetails.documents = allMedia.documents;
    this._cdr.detectChanges();
  }


  viewERx(doesspot_patient_id: number, doesspot_prescription_id: number) {
    this._router.navigate([]).then(result => { window.open(`/admin/prescription/${doesspot_patient_id}/${doesspot_prescription_id}`, '_blank'); });
  }

  async showConditionDetails(conditionId: string, modal: any) {
    this.selectedConditionId = conditionId;
    this.selectedCondition = await this._consultationService.getConditionById(conditionId);
    //document.getElementById('conditionModalBtn')?.click();
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
    const url = `api/v1/consultation/summary/download?consultation_number=${this.consultationDetails.consultation_number_text}&consultation_id=${this.consultationId}`;
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
