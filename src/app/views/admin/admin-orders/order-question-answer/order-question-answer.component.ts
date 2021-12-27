import { Component, Input, Output, OnInit, ViewEncapsulation, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-order-question-answer',
  templateUrl: './order-question-answer.component.html',
  styleUrls: ['./order-question-answer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderQuestionAnswerComponent implements OnInit {
  orderId: any;
  @Input() orderDetails: any;
  @Output() reloadOrderDetails = new EventEmitter();

  loading: boolean = true;
  parentSub: any;
  @BlockUI('questionDetails') questionDetails!: NgBlockUI;
  questions: any[] = []; // = new Array<Question>();
  selectDrug!: any[];
  patient: any;
  userAllergies = [];
  userIllnesses = [];
  redChoiceAnswer: any[] = [];
  greenChioceAnswer: any[] = [];
  yellowChoiceAnswer: any[] = [];
  redChoiceAnswerIds: any[] = [];

  consentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private _route: ActivatedRoute,
    private http: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef,
    private _toastr: Toastr,
    public helper: Helper
  ) {
    this.orderId = this.route.snapshot.paramMap.get('id');
    this.consentForm = new FormGroup({
      'eventName': new FormControl(null, []),
      'answerId': new FormControl(null, [Validators.required]),
      'consentMsg': new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.getQuestionDetails();
    if (this.orderDetails) {
      this.patient = this.orderDetails.user;
      this._getAlardyFillDrugsByUser();
      this._getUserIllnesses();
      this._getUserAllergies();
    }
  }


  ngOnChanges() {
    if (this.orderDetails) {
      this.patient = this.orderDetails.user;
      this._getAlardyFillDrugsByUser();
      this._getUserIllnesses();
      this._getUserAllergies();
    }
  }

  reloadOrder() {
    this.reloadOrderDetails.emit(true);
  }

  openConsentModal(modal: any, eventName: string, answerId: number, defaultConsentMsg: string) {
    this.consentForm.patchValue({
      eventName: eventName,
      answerId: answerId,
      consentMsg: defaultConsentMsg
    });
    modal.show();
  }

  closeConsentModal(modal: any) {
    this.consentForm.reset();
    modal.hide();
  }

  get eventName() { return this.consentForm.get('eventName'); }
  get answerId() { return this.consentForm.get('answerId'); }
  get consentMsg() { return this.consentForm.get('consentMsg'); }

  getQuestionDetails() {
    const url = `api/v1/technician/details/new/` + this.orderId + '/questionaire';
    this.http.get(url)
      .subscribe((data: any) => {

        this.questions = data;
        let filteredSubQuestions = this.questions.filter(q => { return q.type == 'sub' });
        this.questions = this.questions.filter(q => q.type == 'main');
        this.questions = JSON.parse(JSON.stringify(this.questions));
        this.questions.map(q => {
          q.sub_questions = filteredSubQuestions.filter(fq => fq.parent_question_id == q.id);
          return q;
        });

        this.redChoiceAnswer = [];
        this.yellowChoiceAnswer = [];
        this.greenChioceAnswer = [];
        this.questions = data;
        this.questions.forEach((question: any) => {
          if (question.choices[0].result === 1) {
            this.redChoiceAnswer.push(question);
          } else if (question.choices[0].result === 2) {
            this.greenChioceAnswer.push(question);
          } else if (question.choices[0].result === 3) {
            this.yellowChoiceAnswer.push(question);
          }
        });
        this.questions = [];
        this.questions = this.questions.concat(this.redChoiceAnswer, this.yellowChoiceAnswer, this.greenChioceAnswer);
        this.loading = false;
      },
        (err) => {
          this._toastr.showError('Unable to fetch questionnaire details');
        }
      );
  }

  getBorderColorClass(type: string, result: number, hasGivenConsent: boolean) {
    let borderColorClassName: string;
    if (type == 'sub') {
      if (hasGivenConsent) {
        borderColorClassName = 'card blue-left-border';
      } else {
        borderColorClassName = 'card red-left-border';
      }
    } else {
      switch (result) {
        case 1:
          if (hasGivenConsent) {
            borderColorClassName = 'card blue-left-border';
          } else {
            borderColorClassName = 'card red-left-border';
          }
          break;
        case 2:
          borderColorClassName = 'card green-left-border';
          break;
        case 3:
          borderColorClassName = 'card yellow-left-border';
          break;
        default:
          borderColorClassName = 'card';
          break;
      }
    }
    return borderColorClassName;
  }

  private _getAlardyFillDrugsByUser() {
    this.selectDrug = [];
    const url = 'api/v1/orders/getUserOrderDrugs?user_id=' + this.patient.id;
    this.http.post(url, { order_id: this.orderId }).subscribe(
      (data: any) => {
        if (data.length) {
          this.selectDrug = data;
        } else {
          this.selectDrug = [];
        }
        this._changeDetectorRef.detectChanges();
      },
      err => {

        this._changeDetectorRef.detectChanges();
      }
    );
  }
  private _getUserIllnesses() {
    const url = 'api/v1/orders/getUserOrderIllnesses?user_id=' + this.patient.id;
    this.http.post(url, { order_id: this.orderId }).subscribe(
      (data: any) => {
        if (data) {
          this.userIllnesses = data;
        } else {
          this.userIllnesses = [];
        }
        this._changeDetectorRef.detectChanges();
      },
      err => {

        this._changeDetectorRef.detectChanges();
      }
    );
  }

  private _getUserAllergies() {
    const url = 'api/v1/orders/getUserOrderAllergies?user_id=' + this.patient.id;
    this.http.post(url, { order_id: this.orderId }).subscribe(
      (data: any) => {
        if (data) {
          this.userAllergies = data;
        } else {
          this.userAllergies = [];
        }
        this._changeDetectorRef.detectChanges();
      },
      err => {

        this._changeDetectorRef.detectChanges();
      }
    );
  }

  /* getPatientDetails() {
    const url = `api/v1/technician/details/` + this.orderId + '/patient';
    this.http.get(url).subscribe((data) => {
      this.patient = data;
      this._getAlardyFillDrugsByUser();
      this._getUserIllnesses();
      this._getUserAllergies();
      this._changeDetectorRef.detectChanges();
    },
      (err) => {
        this._toastr.showError('Unable to fetch patient details');
      })
  } */

  public getUserLocalDate(date: any, id?: number): any {
    if (date != null && moment(date).isValid()) {
      moment.tz.setDefault();
      const dt = moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
      return dt.local().format('YYYY-MM-DD hh:mm A');
    }
  }

  sendConsent(formValid: boolean, modal: any) {
    if (formValid) {
      let api_url: string, req: any;
      let eventName = this.consentForm.value.eventName;
      if (eventName == 'QUESTION') {
        api_url = 'api/v1/notifications/sendConsentEmail';
        req = {
          customer_id: this.patient.id,
          customer_email: this.patient.email,
          user_answers: [{ 'answer_id': this.consentForm.value.answerId, 'consent_message': this.consentForm.value.consentMsg }],
          customer_first_name: this.patient.first_name,
          customer_last_name: this.patient.last_name,
          order_id: this.orderId,
          consent_message: this.consentForm.value.consentMsg
        };

      } else if (eventName == 'DRUG') {
        api_url = 'api/v1/orders/userDrugs/sendConsent';
        req = {
          user_id: this.patient.id,
          order_id: this.orderId,
          consent_message: this.consentForm.value.consentMsg
        };
      } else if (eventName == 'ILLNESS') {
        api_url = 'api/v1/orders/userIllnesses/sendConsent';
        req = {
          user_id: this.patient.id,
          order_id: this.orderId,
          consent_message: this.consentForm.value.consentMsg
        };
      } else if (eventName == 'ALLERGY') {
        api_url = 'api/v1/orders/userAllergies/sendConsent';
        req = {
          user_id: this.patient.id,
          order_id: this.orderId,
          consent_message: this.consentForm.value.consentMsg
        };
      } else if (eventName == 'BP') {
        api_url = 'api/v1/orders/userBP/sendConsent';
        req = {
          user_id: this.patient.id,
          order_id: this.orderId,
          consent_message: this.consentForm.value.consentMsg
        };
      } else {
        api_url = 'api/v1/orders/userBMI/sendConsent';
        req = {
          user_id: this.patient.id,
          order_id: this.orderId,
          consent_message: this.consentForm.value.consentMsg
        };
      }
      this.http.post(api_url, req).subscribe((data: any) => {
        this._toastr.showSuccess('Sent consent successfully');
        modal.hide();
        this.consentForm.reset();

        if (eventName == 'QUESTION') {
          this.getQuestionDetails();
        } else if (eventName == 'DRUG') {
          this._getAlardyFillDrugsByUser();
        } else if (eventName == 'ILLNESS') {
          this._getUserIllnesses();

        } else if (eventName == 'ALLERGY') {
          this._getUserAllergies();

        } else if (eventName == 'BP') {
          this.reloadOrder();
        } else {
          this.reloadOrder();
        }

        this._changeDetectorRef.detectChanges();
      },
        err => {
          this._toastr.showError('Unable to sent consent');
        });
    } else {
      return;
    }
  }

  sendAllConsent() {
    this.questions.forEach((question: any) => {

      if (question.type == 'sub' && question['has_given_consent'] === 0) {
        const cnst = {
          'answer_id': question['user_answer_id'],
          'consent_message': question['consent_message']
        }
        this.redChoiceAnswerIds.push(cnst);
      }

      if (question.type == 'main' && question.choices[0].result == 1 && question['has_given_consent'] === 0) {
        // this.redChoiceAnswerIds.push(question['user_answer_id']);
        let conset = {
          'answer_id': question['user_answer_id'],
          'consent_message': question.choices[0]['consent_message']
        }
        this.redChoiceAnswerIds.push(conset);
      }
    });
    const url = 'api/v1/notifications/sendConsentEmail';
    const req = {
      customer_id: this.patient.id,
      customer_email: this.patient.email,
      user_answers: this.redChoiceAnswerIds,
      customer_first_name: this.patient.first_name,
      customer_last_name: this.patient.last_name,
      order_id: this.orderId
    };
    this.http.post(url, req).subscribe(
      (data: any) => {

        this._toastr.showSuccess('Sent consent successfully');
        this.getQuestionDetails();
        this._changeDetectorRef.detectChanges();
      },
      err => {
        this._toastr.showError('Unable to sent consent');
        this._changeDetectorRef.detectChanges();
      }
    );
  }
}
