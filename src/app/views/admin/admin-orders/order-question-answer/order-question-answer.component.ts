import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';
import * as moment from 'moment-timezone';
import { ConsentModalComponent } from 'src/app/components/consent-modal/consent-modal.component';
import {ConsentModalService} from 'src/app/components/consent-modal/consent-modal.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-order-question-answer',
  templateUrl: './order-question-answer.component.html',
  styleUrls: ['./order-question-answer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderQuestionAnswerComponent implements OnInit {

  @BlockUI('questionsLoader') blockQuestionsLoader!: NgBlockUI;
  api_url = environment.api_url;
  orderId!: any;
  @Input() orderDetails: any;
  @Output() reloadOrderDetails = new EventEmitter();

  modalRef!: BsModalRef;

	questions:any[]=[];
	patient: any;

	selectDrug: any[] = [];
	userAllergies:any  = null;
	userIllnesses:any[] = [];

	redChoiceAnswer:any[] = [];
	greenChioceAnswer:any[] = [];
	yellowChoiceAnswer:any[] = [];
	redChoiceAnswerIds:any[] = [];

	constructor(
    private modalService: BsModalService,
    private _consentModalService:ConsentModalService,
		private _route: ActivatedRoute,
		private http: HttpClient,
		private _changeDetectorRef: ChangeDetectorRef,
		private _toastr: Toastr,
		public helper: Helper){

	}

	ngOnInit() {
    if (this.orderDetails){
     this.patient = this.orderDetails.user_id;
     this.getQuestionDetails();
    }
  }

  ngOnChanges(){
   if (this.orderDetails){
     this.patient = this.orderDetails.user_id;
     this.selectDrug = this.orderDetails.drugs_taken;
     this.userIllnesses = this.orderDetails.illnesses;
     this.userAllergies = this.orderDetails.allergies;
     this.getQuestionDetails();
   }
  }

 reloadOrder() {
   this.reloadOrderDetails.emit(true);
 }

	openConsentModal(eventName:string,answerId:any,defaultConsentMsg?:any){
    this._consentModalService.setFormData({
      eventName:eventName,
			answerId:answerId,
			consentMsg:defaultConsentMsg
    });
    this.modalRef = this.modalService.show(ConsentModalComponent);
    this.modalRef.content.onEventCompleted.subscribe((receivedEntry:any) => {
        this.sendConsent(receivedEntry);
        this.modalRef.hide();
    });
	}

	getQuestionDetails(){
				this.questions = this.orderDetails.health_questionnaire;
				let filteredSubQuestions=this.questions.filter(q=>{return q.question_type=='sub'});
				this.questions=this.questions.filter(q=>q.question_type=='main');
				this.questions=JSON.parse(JSON.stringify(this.questions));
				this.questions.map(q=>{
					q.sub_questions= filteredSubQuestions.filter(fq=>fq.parent_question_id==q.question_id);
					return q;
				});
			  this.redChoiceAnswer = [];
				this.yellowChoiceAnswer = [];
				this.greenChioceAnswer = [];
				this.questions.forEach((question:any) => {
					if (parseInt(question.choices[0].result, 10) == 1) {
						this.redChoiceAnswer.push(question);
					} else if (parseInt(question.choices[0].result, 10) == 2) {
						this.greenChioceAnswer.push(question);
					} else if (parseInt(question.choices[0].result, 10) == 3) {
						this.yellowChoiceAnswer.push(question);
					}
				});
				this.questions = [];
				this.questions = this.questions.concat(this.redChoiceAnswer, this.yellowChoiceAnswer, this.greenChioceAnswer);
	}

	ngOnDestroy(){
    if(this.blockQuestionsLoader){this.blockQuestionsLoader.unsubscribe();}
	}

	getIconForAnswer(result: any, hasGivenConsent: any){
		let borderColor='';
		switch (result) {
			case 1:
				if (hasGivenConsent) {
					borderColor= '<i class="fas fa-2x fa-comments text-primary mr-2">';
				} else {
					borderColor= '<i class="fas fa-2x fa-exclamation-circle text-danger mr-2"></i>';
				}
				break;
			case 2:
				borderColor= '<i class="fas fa-2x fa-check-circle text-success mr-2"></i>';
				break;
			case 3:
				borderColor= '<i class="fas fa-2x fa-exclamation-triangle text-warning mr-2"></i>';
				break;
			default:
				borderColor= '';
		}
		return borderColor;
	}

	sendConsent(formValue:any){
			let api_url:string,req:any;
			let eventName = formValue.eventName;
      req = {
        customer_id: this.patient._id,
        customer_email: this.patient.email,
        customer_first_name: this.patient.first_name,
        customer_last_name: this.patient.last_name,
        order_id: this.orderId,
        consent_message: formValue.consentMsg
      };

			if(eventName=='QUESTION'){
				req = {
          ...req,
          consent_for:'QUESTION',
					user_answers: [{ 'answer_id': formValue.answerId, 'consent_message': formValue.consentMsg }],
				};
			}else if(eventName=='DRUG'){
        req = {
          ...req,
          consent_for:'DRUG'
				};
			}else if(eventName=='ILLNESS'){
				req = {
          ...req,
          consent_for:'ILLNESS'
				};
			}else if(eventName=='ALLERGY'){
				req = {
          ...req,
          consent_for:'ALLERGY'
				};
			}else if(eventName=='BP'){
				req = {
          ...req,
          consent_for:'BP'
				};
			}else{
				req = {
          ...req,
          consent_for:'BMI'
				};
			}
      api_url = `api/orders/send_consent/${this.orderId}`;
			this.http.post(api_url, req).subscribe((data: any) => {
          this._toastr.showSuccess('Sent consent successfully');
          if(eventName=='QUESTION'){
          }else if(eventName=='DRUG'){
          }else if(eventName=='ILLNESS'){
          }else if(eventName=='ALLERGY'){
          }else if(eventName=='BP'){
          }else{
          }
          this.reloadOrder();
          this._changeDetectorRef.detectChanges();
		  },
			(err:any) => {
				this._toastr.showError('Unable to sent consent');
			});
      return true;
	}

	sendAllConsent(){
		this.questions.forEach((question:any) => {
			if (parseInt(question.choices[0].result, 10) === 1 && question['has_given_consent'] === 0) {
				const conset = {
					'answer_id': question['user_answer_id'],
					'consent_message': question.choices[0]['consent_message']
				}
				this.redChoiceAnswerIds.push(conset);
			}
		});
    let url = `api/orders/send_consent/${this.orderId}`;
		const req = {
      consent_for:'QUESTION',
			customer_id: this.patient._id,
			customer_email: this.patient.email,
			user_answers: this.redChoiceAnswerIds,
			customer_first_name: this.patient.first_name,
			customer_last_name: this.patient.last_name,
			order_id: this.orderId
		};
		this.http.post(url, req).subscribe((data: any) => {
				this._toastr.showSuccess('Sent consent successfully');
        this.reloadOrder();
				this._changeDetectorRef.detectChanges();
    },
    (err:any) => {
      this._toastr.showError('Unable to sent consent');
    });
	}

	public getUserLocalDate(date: any, id?: any){
		if (date != null && moment(date).isValid()) {
			moment.tz.setDefault();
			const dt = moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
			return dt.local().format('YYYY-MM-DD hh:mm A');
		}else{
      return '';
    }
	}

	getPath(fileName: string){
		return 'storage/questionary/' + fileName;
	}

	getDocumentLink(fileName: string){
		return this.api_url + 'storage/questionary/' + fileName;
	}

	isFileTypeImage(fileName: string){
		if(fileName){
		  var extension = fileName.substring(fileName.lastIndexOf('.') + 1);
			if(extension=='png'){ return true;}
			else if(extension=='jpg'){  return true;}
			else if(extension=='jpeg'){  return true;}
			else if(extension=='gif'){  return true ;}
			else {
			  return false;
			}
		}else{
		   return false;
		}
	}

	isFileTypeDoc(fileName: string){
		if(fileName){
			var extension = fileName.substring(fileName.lastIndexOf('.') + 1);
			if(extension=='pdf'){ return true;}
			else if(extension=='docx'){ return true;}
			else{
				return false;
			}
		}else{
			return false;
		}
	}
}
