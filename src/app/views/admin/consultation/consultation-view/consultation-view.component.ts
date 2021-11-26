import { Component, Renderer2, OnInit, ChangeDetectorRef, ViewChild, ViewRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ConsultationService } from '../consultation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Toastr } from '../../../../services/toastr.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';

import { RefundRequestModalComponent } from 'src/app/components/refund-request-modal/refund-request-modal.component';

@Component({
  selector: 'app-consultation-view',
  templateUrl: './consultation-view.component.html',
  styleUrls: ['./consultation-view.component.scss']
})
export class ConsultationViewComponent implements OnInit, AfterViewInit, OnDestroy {
  modalRef!: BsModalRef;
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  loading = false;
  consultationId: any;
  consultationDetails: any;
  patient: any;
  profileLicense: any;

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

  refundData: any;
  formSubmitting: boolean = false;

  constructor(
    public _helper: Helper,
    private _router: Router,
    private _toastr: Toastr,
    private _http: HttpClient,
    private _renderer: Renderer2,
    public _cdr: ChangeDetectorRef,
    private _activeRoute: ActivatedRoute,
    private modalService: BsModalService,
    private _consultationService: ConsultationService) {

    this.consultationId = this._activeRoute.snapshot.paramMap.get('id');
  }


  async ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
    this.loadRiskFactors();
    await this.loadConsultationDetails();
  }


  rerender(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
  }

  ngAfterViewInit(): void {
    this._renderer.listen('document', 'click', (event: any) => {
      if (event.target.hasAttribute('consultationDetailID')) {
        this.gotoConsultation(event.target.getAttribute('consultationDetailID'));
      }
    });
  }


  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
      });
    }
  }


  gotoConsultation(consultationID: number) {
    //this._router.navigate(['admin','consultation','view',consultationID]);
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`/admin/consultation/view/${consultationID}`])
    });
  }

  getDTOptions(patientId: number) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback: any) => {
        this.blockDataTable.start();
        this._consultationService.getConsultationList(patientId, dataTablesParameters).then((resp: any) => {
          this.blockDataTable.stop();
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });
      },
      columns: [
        {
          data: 'consultation_number',
          title: 'Consultation Number',
          className: 'text-center',
          render: function (data: any, type: any, record: any) {
            return `<a consultationDetailID=${record.id} href="javascript:void(0);" class="text-primary font-weight-bold">C-${data}</a>`;
          }
        },
        {
          data: 'consultation_type',
          title: 'Consultation Type',
          className: 'text-center',
          render: function (data: any, type: any, record: any) {
            if (data == 'NEW') {
              return '<span class="badge badge-success">NEW</span>'
            } else {
              return '<span class="badge badge-primary">FOLLOWUP</span>'
            }
          }
        },
        {
          data: 'type',
          title: 'Type',
          className: 'text-center',
          render: function (data: any, type: any, record: any) {
            if (data == 'REFERRED_BY_PHYSICIAN') {
              return '<span class="badge badge-primary">Referred By Physician</span>'
            } else {
              return '<span class="badge badge-warning">First Available Physician</span>'
            }
          }
        },
        {
          data: 'doctor_name',
          title: 'Physician Name',
          className: 'text-center',
          render: function (data: any, type: any, record: any) {
            if (data) {
              return data;
            } else {
              return '-'
            }
          }
        },
        {
          data: 'pharmacy_name',
          title: 'Pharmacy Name',
          className: 'text-center',
          render: function (data: any, type: any, record: any) {
            if (data) {
              return data;
            } else {
              return '-'
            }
          }
        },
        {
          data: 'consultation_charge',
          title: 'Consultation Charge',
          className: 'text-center',
          render: function (data) {
            const _helper = new Helper();
            return _helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'system_status',
          title: 'Status',
          className: 'text-center',
          render: function (data: any, type: any, record: any) {
            if (data == 'ASSIGNED_TO_TECHNICIAN') { return `<span class="badge badge-info">Assigned To Technician</span>`; }
            if (data == 'APPROVED_BY_TECHNICIAN') { return `<span class="badge badge-info">Approved To Technician</span>`; }
            else if (data == 'ASSIGNED_TO_DOCTOR') { return `<span class="badge badge-primary">Assigned To Doctor</span>` }
            else if (data == 'CONSULTATION_COMPLETED') { return `<span class="badge badge-success">Completed</span>` }
            else if (data == 'CONSULTATION_REFUNDED') { return `<span class="badge badge-danger">Refunded</span>` }
            else { return ''; }
          }
        },
        {
          data: 'created_at',
          title: 'Date',
          className: 'text-center',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        }
      ]
    };
    if (this._cdr && !(this._cdr as ViewRef).destroyed) {
      this._cdr.detectChanges();
    }
  }

  async loadRiskFactors() {
    this.allRiskFactors = await this._consultationService.loadRiskFactors();
  }

  gotoPatientDetails() {
    this._router.navigate(['admin', 'patients', 'view', this.consultationDetails.patient_details.id, 'orders']);
  }

  async loadConsultationDetails() {
    this.loading = true;
    this.consultationDetails = await this._consultationService.getConsultationDetails(this.consultationId);
    this.patient = this.consultationDetails.patient_details;
    this.profileLicense = this.consultationDetails.profile_license;
    this.patient.age = this._helper.calculateAge(this.patient.date_of_birth, 'YYYY-MM-DDTHH:mm:ss.000Z');

    this.loading = false;
    this.patientUinqueNumber = this._helper.getUserUniqueId(this.consultationDetails.patient_details.id, this.consultationDetails.patient_details.type);
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

    this.getDTOptions(this.consultationDetails.user_id);
    this.dtTrigger.next();
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
        q.sub_questions = filteredSubQuestions.filter(fq => fq.parent_question_id == q.id);
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
    if (uploaded_by_id == this.consultationDetails.user_id) { return 'By Patient' }
    else if (uploaded_by_id == this.consultationDetails.doctor_id) { return 'By Physician' }
    else { return ''; }
  }

  openDocument(path: string) {
    this._router.navigate([]).then(result => { window.open(`${environment.api_url + path.substring(1)}`, '_blank'); });
  }

  async removeMediaById(id: number) {
    let bodyData = {
      media_id: id,
      consultation_id: this.consultationId
    }
    let deleted = await this._consultationService.removeConsultationMediaById(bodyData);
    await this.reloadMedia();
  }

  async reloadMedia() {
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
    document.getElementById('conditionModalBtn')?.click();
  }


  getSystemStatus(status: string) {
    if (status == 'ASSIGNED_TO_TECHNICIAN') {
      return `<span class='p-2 badge badge-pill badge-info'>Assigned To Technician</span>`;
    }
    else if (status == 'APPROVED_BY_TECHNICIAN') {
      return `<span class='p-2 badge badge-pill badge-info'>Approved By Technician</span>`;
    }
    else if (status == 'ASSIGNED_TO_DOCTOR') {
      return `<span class='p-2 badge badge-pill badge-primary'>Assigned To Doctor</span>`;
    } else if (status == 'CONSULTATION_COMPLETED') {
      return `<span class='p-2 badge badge-pill badge-success'>Completed</span>`;
    } else if (status == 'CONSULTATION_REFUND_REQUESTED') {
      return `<span class='p-2 badge badge-pill badge-danger'>Refund Requested</span>`;
    } else if (status == 'CONSULTATION_REFUND_PROCESSED') {
      return `<span class='p-2 badge badge-pill badge-danger'>Refund Processed</span>`;
    }
    else if (status == 'REJECTED_BY_TECHNICIAN') {
      return `<span class='p-2 badge badge-pill badge-danger'>Rejected By Technician</span>`;
    }
    else if (status == 'INCOMPLETE') {
      return `<span class='p-2 badge badge-pill badge-warning'>Incomplete</span>`;
    } else {
      return '';
    }
  }

  getCustomerStatus(status: string) {
    if (status == 'UNDER_REVIEW') {
      return `<span class="p-2 badge badge-pill badge-info">Under Review</span>`;
    }
    else if (status == 'SCHEDULED') {
      return `<span class="p-2 badge badge-pill badge-primary">Scheduled</span>`;
    }
    else if (status == 'REFUNDED') {
      return `<span class="p-2 badge badge-pill badge-danger">Refunded</span>`;
    }
    else if (status == 'COMPLETED') {
      return `<span class="p-2 badge badge-pill badge-success">Completed</span>`;
    }
    else if (status == 'INCOMPLETE') {
      return `<span class="p-2 badge badge-pill badge-warning">Incomplete</span>`;
    }
    else {
      return '';
    }
  }
  getTechnicianStatus(status: string) {
    if (status == 'RECEIVED') {
      return `<span class="p-2 badge badge-pill  badge-info">Received</span>`;
    } else if (status == 'APPROVED') {
      return `<span class="p-2 badge badge-pill  badge-success">Approved</span>`;
    } else if (status == 'REJECTED') {
      return `<span class="p-2 badge badge-pill  badge-danger">Rejected</span>`;
    } else if (status == 'REFUNDED') {
      return `<span class="p-2 badge badge-pill  badge-danger">Refunded</span>`;
    } else { return ''; }
  }

  getDoctorStatus(status: string) {
    if (status == 'RECEIVED') {
      return `<span class="p-2 badge badge-pill badge-info">Received</span>`;
    } else if (status == 'PRESCRIBED') {
      return `<span class="p-2 badge badge-pill badge-warning">Prescibed</span>`;
    } else if (status == 'COMPLETED') {
      return `<span class="p-2 badge badge-pill badge-success">Completed</span>`;
    } else if (status == 'REFUNDED') {
      return `<span class="p-2 badge badge-pill badge-danger">Refunded</span>`;
    } else { return ''; }
  }

  async downloadReceipt() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    const url = `api/v1/consultation/download?consultation_number=${this.consultationDetails.consultation_number_text}&consultation_id=${this.consultationId}`;
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
      /* CALL METHOD TO MAKE API CALL TO SAVE ADDRESS */
      // this.refundConsultationFormSubmit()
    });
  }

  refundConsultationFormSubmit(formValues: any) {
    this.formSubmitting = true;
    const apiURL = 'api/v1/consultation/refund_requested';
    const obj = {
      consultation_id: this.consultationId,
      refund_reason: formValues.refund_reason
    };
    this._http.post(apiURL, obj).subscribe((data) => {
      this.formSubmitting = false;
      this.refundData = data;
      document.getElementById('hiderefundModal')?.click();
      this._toastr.showSuccess('Refund request send successfully');
      this.loadConsultationDetails();
      this._cdr.detectChanges();
    }, err => {
      document.getElementById('hiderefundModal')?.click();
      this.formSubmitting = false;
      this._toastr.showError('Unable to send refund request');
    });
  }
}
