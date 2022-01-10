import { Component, OnInit,OnDestroy, ViewEncapsulation, ChangeDetectorRef, AfterViewInit ,ViewChild,ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/models/Question';
import { Choice } from 'src/app/models/choice';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper} from 'src/app/services/helper.service';

@Component({
  selector: 'app-questions-preview',
  templateUrl: './questions-preview.component.html',
  styleUrls: ['./questions-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionPreviewComponent implements OnInit,OnDestroy {
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
  ];
  screen_mode='QUESTION_ANSWER';

  @BlockUI('question') blockQuestionAnswerUI!: NgBlockUI;
  @BlockUI('statesAvaibility') blockStatesAvaibilityUI!: NgBlockUI;

  questions: Array<Question>;
  currentQuestion: any;
  currentChoice!: Choice;
  currentQuestionIndex = 0;
  showValidationMsg = false;
  showSelectAnsMsg = false;
  submitted = false;
  isAnsCorrect = false;
  switchQuestion = false;

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

    let activeRoute:any = this.route;
    this.medicineKitId = activeRoute.parent.parent.snapshot.paramMap.get('kit_id');
    this.healthConditionId = activeRoute.parent.parent.snapshot.paramMap.get('condition_id');

    let self= this
    if (this.medicineKitId){
      self.getAllStates().then((result) => {
        self.stateList = result;
        self.showHeaderAndFilter = false;
        self.selectedKitId = self.medicineKitId;
        self.handleCheckAll({checked: true}, 'STATE');
        this.getQuestionsList();
      });
    }
    if(this.healthConditionId){
      self.getAllStates().then((result) => {
        self.selectedCategory = 'CONSULTATION';
        self.stateList = result;
        self.showHeaderAndFilter = false;
        self.selectedConditionId = self.healthConditionId;
        self.handleCheckAll({checked: true}, 'STATE');
        this.getQuestionsList();
      });
    }

    this.questions = new Array<Question>();
    this.currentQuestion = new Question();
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

  public getQuestionsList(){
    if (this.selectedConditionId != null || this.selectedKitId != null || this.selectedKitId.length > 0 ) {
      let url: string = this.selectedCategory == 'ORDER' ? `api/medicine_kits/questions/${this.selectedKitId}?states=${this.selectedStateId}` : `api/consultation_health_conditions/questions/${this.selectedConditionId}?states=${this.selectedStateId}`
      this.http.get(url).subscribe((data: any) => {
          this.questions = data.map((item:any)=>item.question_id);
          this.questions = this.questions.map((qitem:any)=>{
              if(qitem.choices){
                qitem.choices = qitem.choices.map((citem:any)=>{
                    if(citem.has_subquestions && citem.sub_questions){
                        citem.sub_questions = citem.sub_questions.map((sq:any)=>{
                            let updated_item={
                                  created_at: sq.created_at,
                                  update_at: sq.update_at,
                                  parent_question_id:  sq.parent_question_id,
                                  question_type: "sub",
                                  choices: sq.subquestion_option_type=='choise' && sq.choices ? sq.choices:[],
                                  is_active: sq.is_active,
                                  option_type: sq.subquestion_option_type,
                                  has_input: sq.subquestion_option_type=='input'?true:false,
                                  custom_input:'',
                                  is_multi_select:false,
                                  text:sq.subquestion_question_text,
                                  states:qitem.states,
                                  dtc_medicine_kits:qitem.dtc_medicine_kits,
                                  consultation_health_conditions:qitem.consultation_health_conditions,
                                  _id: sq._id
                            };
                            return updated_item;
                        });
                        return citem;
                    }else{
                      return citem;
                    }
                });
                return qitem;
              }else{
                return qitem;
              }
          });
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
    this.http.get(url).subscribe((medicineKitList: any) => {
        this.medicineKits = medicineKitList;
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

  async getAllStates() {
    return await this.http.get<any>('api/system_states/all').toPromise();
  }

  public resetValues(){
    this.medicineKits = [];
    this.questions = [];
    this.selectedKitId = null;
  }

  public resetKit(){
    this.questions = [];
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

  get notSelectedStates(){
    return this.stateList.filter((data: any) => !this.selectedStateId.some((b: any) => b === data._id)).length
  }

  public goToPreviousQuestion(){
    this.switchQuestion = true;
    this.showSelectAnsMsg = false;
    if(this.currentQuestionIndex > 0){
      this.currentQuestionIndex = (this.currentQuestionIndex - 1);
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.getStateCount();
      let outerThis= this;
      let preQues= this.questions.filter((question,index)=>{return index<=outerThis.currentQuestionIndex});
      let nextQues = this.questions.filter(function(question,index){
        return index > outerThis.currentQuestionIndex && question.question_type=='main';
      });
      this.questions=Array.prototype.concat(preQues,nextQues);
    }
    this.switchQuestion = false;
  }

  getNextQuestion(currentQuestion: any){
    this.switchQuestion = true;
    this.showValidationMsg = false;
    this.showSelectAnsMsg = false;
    this.blockQuestionAnswerUI.start();

    console.log('getNextQuestion  = currentQuestion ==',currentQuestion);

    if (this._checkAnsIsSelected(currentQuestion.question_type,currentQuestion.has_input,currentQuestion.choices)){
      if (this._checkAnsIsValid(currentQuestion)){
        setTimeout(() => {
          if(this.questions[this.currentQuestionIndex + 1]){
            this.currentQuestionIndex += 1;
            this.currentQuestion = this.questions[this.currentQuestionIndex];
            this.getStateCount();
            // this.setFilesForQuestionsChoises();
            this.switchQuestion = false;
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

  skipAndGotoNextQuestion(){
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
      }else{
        this.screen_mode= 'QUESTION_COMPLETED';
      }
      this._changeDetectorRef.detectChanges();
      this.blockQuestionAnswerUI.stop();
    });
  }


  _checkAnsIsSelected(questionType:string,questionHasInput:any,choices: Array<Choice>): any {
    console.log('_checkAnsIsSelected ==',`questionType ==${questionType} , questionHasInput==${questionHasInput} , choices == ${choices.length}`);
     if(questionType=='sub' || questionHasInput){
       return true;
     }
     else{
      let checkedChoices = choices && choices.length ? choices.filter((cho:any)=>cho.isChecked):[];
      let checkedChoicesRequiredFiles = checkedChoices.length>0 ? checkedChoices.filter((ccho:any)=>ccho.has_file_upload):[];
      let checkedChoicesAddedFiles = checkedChoicesRequiredFiles.length>0 ? checkedChoicesRequiredFiles.filter((ccho:any)=> ccho.custom_file_upload!=null):[];

      // CHECK IF AT LEAST ONE CHOISE CHEKED
      if (checkedChoices.length>0){
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
    //console.log('currentQuestion.question_type =',currentQuestion.question_type);
    if (currentQuestion.question_type=='sub' && currentQuestion.has_input){
      return true;
    } else {
      let isValid:boolean = false;
      if(currentQuestion.choices){
        for (var i = 0; i < currentQuestion.choices.length; i++){
          if (currentQuestion.choices[i].isChecked &&
            //(only Red choises) currentQuestion.choices[i].result == 1 &&
            currentQuestion.choices[i].has_subquestions){
                // Adding Choise's subquestions to Question Flow
                //console.log('inside if condition');
                let choiseSubQAll=currentQuestion.choices[i].sub_questions;
                let choiseSubQ= choiseSubQAll.filter((csq:any)=>{return csq.is_deleted!=1;});
                //console.log('choiseSubQ ==',choiseSubQ);
                for(let j=0 ; j< choiseSubQ.length ;j++){
                    //console.log('inside for loop');
                    let sub_question=  choiseSubQ[j];
                    if(this.questions.filter((q:any)=>q._id==sub_question._id).length==0){
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
                  (!currentQuestion.choices[i].has_subquestions)
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


                if(!currentQuestion.choices[i].isChecked){
                  let preQues= this.questions.filter((question,index)=>{return index<=outerThis.currentQuestionIndex});
                  let nextQues = this.questions.filter(function(question,index){
                  return index > outerThis.currentQuestionIndex && question.question_type=='main';
                  });
                  this.questions=Array.prototype.concat(preQues,nextQues);
                }
                isValid = true;
           }
        }
      }else{
        isValid=true;
      }
      //console.log('isValid ==',isValid);
      return isValid;
    }
  }

  checkAnsIsValidForCheckboxQuestion(question: Question): any {
    if(question && question.choices){
        question.choices.forEach((t: any, index: any) => {
          if(t.isChecked && t.has_file_upload) {
            // this.creatUploader(t._id);
          }else {
            // this.removeUploader(t);
          }
        });
    }
    if(this._checkAnsIsValid(question)){
      this.showSelectAnsMsg = false;
    } else {
      this.showSelectAnsMsg = true;
    }
  }

  updateIschecked(choice: Choice){
    this.currentChoice = choice;
    if(this.currentQuestion.choices){
      this.currentQuestion.choices.forEach((t: any) => {
        t.isChecked = t._id == choice._id;
      });
    }

    if (!choice.has_file_upload) {
      this.getNextQuestion(this.currentQuestion);
    }
  }


  getStateCount(){
    this.blockStatesAvaibilityUI.start()
    this.tempStateList = this.stateList.map((object: any) => ({ ...object }))
    if (this.currentQuestion && this.currentQuestion.states){
      this.currentQuestion.states.filter((cs: any) => {
        let inx = this.tempStateList.findIndex((state: any, index: any) => state._id == cs._id)
        this.tempStateList[inx].isAvailable = true
      })
    }
    this.blockStatesAvaibilityUI.stop();
  }


  restartQuestionnaire(){
    for(let i=0;i<this.questions.length;i++){
      if(this.questions[i] && this.questions[i].choices){
        this.questions[i].choices.forEach(t => {
          t.isChecked = false;
        });
      }
    }
    this.currentQuestionIndex = 0;
    this.currentQuestion = this.questions[0];
    this.getStateCount();
    this.screen_mode='QUESTION_ANSWER';
    this.fileUploader = [];
    this._changeDetectorRef.detectChanges();
  }

  resetCurentQuestionOptions(){
    if(this.currentQuestion && this.currentQuestion.choices){
      this.currentQuestion.choices.forEach((t: any) => {
        t.isChecked = false;
      });
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
