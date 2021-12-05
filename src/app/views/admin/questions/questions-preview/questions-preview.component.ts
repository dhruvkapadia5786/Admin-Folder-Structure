import { Component, OnInit,OnDestroy, ViewEncapsulation, ChangeDetectorRef, AfterViewInit ,ViewChild,ElementRef } from '@angular/core';

import { MedicineKit } from 'src/app/models/MedicineKit';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/models/Question';

import { Choice } from 'src/app/models/choice';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Toastr } from 'src/app/services/toastr.service';
import { User } from 'src/app/models/User';
import { FormControl } from '@angular/forms';

import { Payment } from 'src/app/models/Payment';
import { Order } from 'src/app/models/order';
import { Observable } from 'rxjs/Observable';
import { Helper} from 'src/app/services/helper.service';

@Component({
  selector: 'app-questions-preview',
  templateUrl: './questions-preview.component.html',
  styleUrls: ['./questions-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionPreviewComponent implements OnInit,OnDestroy,AfterViewInit {
  public conditions: any = [];
  public medicineKits: any = [];
  public stateList: any = [];
  public tempStateList: any = [];
  
  public selectedConditionId: any = null;
  public selectedKitId: any = null;
  public selectedStateId: any = [];
  public availableInState: any = [];
  fileUploader: any = [];

  selectedCategory: any = 'ORDER';
  public categoryList: any = [
    { type: 'Order', value: 'ORDER' },
    { type: 'Consultation', value: 'CONSULTATION' }
  ]

  screen_mode='QUESTION_ANSWER';
  showReAuthorizePaymentScreen:boolean=false;

  @BlockUI('question') blockQuestionAnswerUI!: NgBlockUI;
  @BlockUI('statesAvaibility') blockStatesAvaibilityUI!: NgBlockUI;

  incompleteOrder!:boolean;
  videoConsultationRequiredByState:boolean=false;
  questions: Array<Question>;
  incompleteOrderAnswers!: any[];
  currentQuestion: any;
  currentChoice!: Choice;
  currentQuestionIndex = 0;
  showValidationMsg = false;
  showSelectAnsMsg = false;
  submitted = false;
  isAnsCorrect = false;
  medicineKit = new MedicineKit();
  loggedInUser = new User();
  switchQuestion = false;
  options: any = [];
  selectDrug: any = [];
  myControl: any = new FormControl();
  globalMedicineKit: any;
  public illnessesForm!: any[];
  public allergiesForm!: any[];
  public userIllnesses = '';
  public userAllergies = '';
  public isDrugCheck = false;
  public isIllnessesCheck = false;
  public allergiesCheck = false;
  orderAttemptId = null;
  orderId :any;

 
  payment: Payment;
  order!: Order;

  api_url = environment.api_url;
  chargeApiCallObservable!: Observable<any>;

  @ViewChild('cardInfo') cardInfo!: ElementRef;

  medicineKitId: any;
  healthConditionId: any;
  showHeaderAndFilter: boolean = true;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _helper:Helper){

    this.getMedicineKits();
    this.getAllHealthConditions();

    this.medicineKitId = this.route.parent?.parent?.snapshot.paramMap.get('kit_id');
    this.healthConditionId = this.route.parent?.parent?.snapshot.paramMap.get('condition_id');

    let self= this
    if (this.medicineKitId) {
      self.getAllStates().then((result) => {
        self.stateList = result;
        self.showHeaderAndFilter = false;
        self.selectedKitId = self.medicineKitId;
        self.handleCheckAll({checked: true}, 'STATE');
        this.getQuestionsList();
      });
    }
    
    if (this.healthConditionId) {
      self.getAllStates().then((result) => {
        self.selectedCategory = 'CONSULTATION';
        self.stateList = result;
        self.showHeaderAndFilter = false;
        self.selectedConditionId = self.healthConditionId;
        self.handleCheckAll({checked: true}, 'STATE');
        this.getQuestionsList();
      });
    }

    this.payment = new Payment();

    this.questions = new Array<Question>();
    this.currentQuestion = new Question();
    this.medicineKit = new MedicineKit();
  }

  ngOnInit(){
    if (this.stateList.length == 0) {
      this.getAllStates().then((result) => {
        this.stateList = result;
      });
    }
  }

  ngOnDestroy(){
  } 

  public getQuestionsList() {
    if (this.selectedConditionId != null || this.selectedKitId != null || this.selectedKitId.length > 0 ) {
      let url: string = this.selectedCategory == 'ORDER' ? `api/medicine_kits/questions/${this.selectedKitId}?states=${this.selectedStateId}` : `api/consultation_health_conditions/questions/${this.selectedConditionId}?states=${this.selectedStateId}` 
  
      this.http.get(url)
        .subscribe((data: any) => {
          this.questions = data
          this.currentQuestionIndex = 0;
          this.currentQuestion = this.questions[this.currentQuestionIndex];
          this.getStateCount()
          this._changeDetectorRef.detectChanges();
        }, err => {
          
        });
    } else {
      this._toastr.showWarning('Please select kit/condition.');
      return;
    }
  }

  public getAllHealthConditions() {
    const url = 'api/consultation_health_conditions/all';
    this.http.get(url)
      .subscribe((conditionsList: any) => {
        this.conditions = conditionsList;
        this._changeDetectorRef.detectChanges();
      }, err => {
        
      });
  }

  public getMedicineKits() {
    this.resetValues();
    const url = 'api/medicine_kits/all';
    this.http.get(url)
      .subscribe((medicineKitList: any) => {
        this.medicineKits = medicineKitList;
        this._changeDetectorRef.detectChanges();
      }, err => {
        
      });
  }

  async getAllStates() {
    return await this.http.get<any>('api/system_states/all').toPromise();
  }

  public resetValues() {
    this.medicineKits = [];
    this.questions = [];
    this.selectedKitId = null;
  }
  
  public resetKit() {
    this.questions = [];
  }
  
  ngAfterViewInit() {
    this.selectDrug = [];
    this._changeDetectorRef.detectChanges();
  }

  public handleCheckAll (event:any, flag:any) {
    if (flag == 'STATE') {
      if (event.checked) {
        this.selectedStateId = this.stateList.map((data: any) => data._id);
      } else {
        this.selectedStateId = [];
      }
    }
  }

  get notSelectedStates () {
    return this.stateList.filter((data: any) => !this.selectedStateId.some((b: any) => b === data._id)).length
  }

  public goToPreviousQuestion(){
    this.showSelectAnsMsg = false;
    if(this.currentQuestionIndex > 0){
      this.currentQuestionIndex = (this.currentQuestionIndex - 1);
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      // this.setFilesForQuestionsChoises();
      this.getStateCount()
      let outerThis= this;
      let preQues= this.questions.filter((question,index)=>{return index<=outerThis.currentQuestionIndex});
      let nextQues = this.questions.filter(function(question,index){
        return index > outerThis.currentQuestionIndex && question.type=='main';
      });
      this.questions=Array.prototype.concat(preQues,nextQues);
    }
  }

  getNextQuestion(currentQuestion: any) {
    this.switchQuestion = true;
    this.showValidationMsg = false;
    this.showSelectAnsMsg = false;
    this.blockQuestionAnswerUI.start();
    if (this._checkAnsIsSelected(currentQuestion.type,currentQuestion.has_input,currentQuestion.choices)) {
      if (this._checkAnsIsValid(currentQuestion)){
        setTimeout(() => {
          if(this.questions[this.currentQuestionIndex + 1]){
            this.currentQuestionIndex += 1;
            this.currentQuestion = this.questions[this.currentQuestionIndex];
            this.getStateCount();
            // this.setFilesForQuestionsChoises();
            this.switchQuestion = false;
            let preventedQuestionIds=[33,34,35];
            let previousQuestionId = this.questions[this.currentQuestionIndex-1].id;
            if(preventedQuestionIds.indexOf(previousQuestionId)==-1){
              this.blockQuestionAnswerUI.stop();
            }
          }else{
            this.screen_mode= 'QUESTION_COMPLETED';
          }
          this.blockQuestionAnswerUI.stop();
        });
      } else {
        this.blockQuestionAnswerUI.stop();
        this.showValidationMsg = true;
        this.switchQuestion = false;
      }
    } else {
      this.blockQuestionAnswerUI.stop();
      this.showSelectAnsMsg = true;
      this.switchQuestion = false;
    }
  }
  _saveSubQuestionAnswer(currentQuestion:Question){
    if (currentQuestion.custom_input && currentQuestion.custom_input.length>0) {
      this.showSelectAnsMsg = false;
      this.getNextQuestion(currentQuestion);
      this._changeDetectorRef.detectChanges();
    } else {
      this.showSelectAnsMsg = true;
    }
  }

  skipAndGotoNextQuestion () {
    this.showSelectAnsMsg = false;
    this.showValidationMsg = false;

    this.blockQuestionAnswerUI.start();
    setTimeout(() => {
      if(this.questions[this.currentQuestionIndex + 1]){
        this.currentQuestionIndex += 1;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        this.getStateCount();
        // this.setFilesForQuestionsChoises();
        this.switchQuestion = false;
        let preventedQuestionIds=[33,34,35];
        let previousQuestionId = this.questions[this.currentQuestionIndex-1].id;
        if(preventedQuestionIds.indexOf(previousQuestionId)==-1){
          this.blockQuestionAnswerUI.stop();
        }
      }else{
        this.screen_mode= 'QUESTION_COMPLETED';
      }
      this._changeDetectorRef.detectChanges();
      this.blockQuestionAnswerUI.stop();
    });
  }

  
  _checkAnsIsSelected(questionType:string,questionHasInput:any,choices: Array<Choice>): any {
    //console.log('_checkAnsIsSelected ==',`questionType ==${questionType} , questionHasInput==${questionHasInput} , choices == ${choices.length}`);
     if(questionType=='sub' || questionHasInput==1){
       return true;
     }
     else{
      let checkedChoices = choices.filter((cho:any)=>cho.isChecked);
      let checkedChoicesRequiredFiles = checkedChoices.filter((ccho:any)=>ccho.has_file_upload);
      let checkedChoicesAddedFiles = checkedChoicesRequiredFiles.filter((ccho:any)=> ccho.custom_file_upload!=null);

      // CHECK IF AT LEAST ONE CHOISE CHEKED
      if (checkedChoices.length>0) {
        if(checkedChoicesRequiredFiles.length>0){
          if(checkedChoicesRequiredFiles.length==checkedChoicesAddedFiles.length){
            return true; 
          }else{
            return false; 
          }
        }else{
          return true;
        }
      }else{
          // IF MULTIPLE CHOISE QUESTION NO CHOISE CHEKED
        return false;
      }
     }
   }
 

  _checkAnsIsValid(currentQuestion: any): any {
    //console.log(' ===  _checkAnsIsValid called==');
    //console.log('currentQuestion.type =',currentQuestion.type);
    if (currentQuestion.type=='sub' && currentQuestion.has_input==1){ 
      return true;
    } else {
      let isValid:boolean = false;
      for (var i = 0; i < currentQuestion.choices.length; i++) {
        if (
          currentQuestion.choices[i].isChecked &&
          //(only Red choises) currentQuestion.choices[i].result == 1 &&
          currentQuestion.choices[i].has_subquestions ==1
        ){
          // Adding Choise's subquestions to Question Flow
          //console.log('inside if condition');
          let choiseSubQAll=currentQuestion.choices[i].sub_questions;
          let choiseSubQ= choiseSubQAll.filter((csq:any)=>{return csq.is_deleted!=1;});
          //console.log('choiseSubQ ==',choiseSubQ);
          for(let j=0 ; j< choiseSubQ.length ;j++){
              //console.log('inside for loop');
              let sub_question=  choiseSubQ[j];
              if(this.questions.filter((q:any)=>q.id==sub_question.id).length==0){
                this.questions.splice(this.currentQuestionIndex+j+1, 0,sub_question);
                //console.log('this.questions =', this.questions);
              }
          }
          isValid = true;
         }else{
            //console.log('=====inside else ====');
            let outerThis=this;
           if (
             currentQuestion.choices[i].isChecked &&
            // (not Red choises) currentQuestion.choices[i].result != 1 &&
             (currentQuestion.choices[i].has_subquestions == 0 || currentQuestion.choices[i].has_subquestions ==null)
           ){
             //console.log('INSIDE CONDItiON choises',currentQuestion.choices[i]);
             let preQues= this.questions.filter((question,index)=>{return index<=outerThis.currentQuestionIndex});
             //console.log('preQues ==',preQues);
             let nextQues = this.questions.filter(function(question,index){
               return index > outerThis.currentQuestionIndex;// && question.type=='main';
             });
             //console.log('nextQues ==',nextQues);
             this.questions=Array.prototype.concat(preQues,nextQues);
             //console.log('this.questions ==',this.questions);
           }
           isValid = true;
         }
      }
      //console.log('isValid ==',isValid);
      return isValid;
    }
  }

  checkAnsIsValidForCheckboxQuestion(question: Question): any {
    question.choices.forEach((t: any, index: any) => {
      if(t.isChecked && t.has_file_upload) {
        // this.creatUploader(t.id);
      }else {
        // this.removeUploader(t);
      }
    });
    if (this._checkAnsIsValid(question)) {
      this.showSelectAnsMsg = false;
    } else {
      this.showSelectAnsMsg = true;
    }
  }

  updateIschecked(choice: Choice) {
    this.currentChoice = choice;
    this.currentQuestion.choices.forEach((t: any) => {
      t.isChecked = t.id == choice.id;
    });
    if (!choice.has_file_upload) {
      this.getNextQuestion(this.currentQuestion);
    }
  }


  getStateCount() {
    this.blockStatesAvaibilityUI.start()
    this.tempStateList = this.stateList.map((object: any) => ({ ...object }))
    if (this.currentQuestion && this.currentQuestion.states) {

      this.currentQuestion.states.filter((cs: any) => {
        let inx = this.tempStateList.findIndex((state: any, index: any) => state._id == cs.id)
        this.tempStateList[inx].isAvailable = true
      })
    }
    this.blockStatesAvaibilityUI.stop();
  }

  selectedDrug(ele: any) {
    this.isDrugCheck = false;
    this.resetCurentQuestionOptions();
    const obj = {
      rxcui: ele.rxcui,
      name: ele.name
    };
    this.selectDrug.push(obj);
    this.myControl.setValue(null);
    this.myControl.reset();
    this.myControl.updateValueAndValidity()
    this._changeDetectorRef.detectChanges();
  }

  restartQuestionnaire(){
    for(let i=0;i<this.questions.length;i++){
      this.questions[i].choices.forEach(t => {
        t.isChecked = false;
      });
    }
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.questions[0];
    this.getStateCount();
    this.screen_mode='QUESTION_ANSWER';
    this.options = [];
    this.fileUploader = [];
    this._changeDetectorRef.detectChanges();
  }

  resetCurentQuestionOptions() {
    this.currentQuestion.choices.forEach((t: any) => {
      t.isChecked = false;
    });
    this.options = [];
    this._changeDetectorRef.detectChanges();
  }

  public resetAllergiesOptionChecked() {
    this.allergiesCheck = false;
  }

  public resetIllnessesOptionChecked() {
    this.isIllnessesCheck = false;
  }

  removeDrug(index:number) {
    if (index !== -1) {
      this.selectDrug.splice(index, 1);
    }
    this._changeDetectorRef.detectChanges();
  }

  customeInputRadioChecked(isValid:boolean) {
    // var isValid = false;
    if (isValid) {
      this.myControl.reset();
      this.selectDrug = [];
      this.options = [];
      this.isDrugCheck = true;
    } else {
      this.isDrugCheck = false;
      this.myControl.reset();
      this.myControl.enable();
    }
    this._changeDetectorRef.detectChanges();
  }

  illnessesRadioChecked(isChecked:boolean) {
    if(isChecked){
      this.userIllnesses = '';
      this.isIllnessesCheck = true;
    } else {
      this.isIllnessesCheck = false;
    }
    this._changeDetectorRef.detectChanges();
  }

   
  allergiesRadioChecked(isChecked:boolean) {
    if (isChecked) {
      this.userAllergies = '';
      this.allergiesCheck = true;
    } else {
      this.allergiesCheck = false;
    }
    this._changeDetectorRef.detectChanges();
  }

  handleChange(category: any) {
    if (category == 'ORDER') {
      this.selectedConditionId = null
    } else if (category == 'CONSULTATION') {
      this.selectedKitId = null
    }
  }

}
