import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateQuestionComponent implements OnInit {
  public addQuestion!: FormGroup;
  public choicesArr!: FormArray;
  public subQuestionArr!: FormArray;

  public medicineKitList: any;
  public petTypeList: any;
  public healthConditionsList: any = [];
  public flowTypeList: any = [
    { type: 'Order', value: 'ORDER' },
    { type: 'Consultation', value: 'CONSULTATION' },
    { type: 'General', value: 'GENERAL' }
  ]
  public questionObj: any = {};
  public choiceObj: any = {};
  public statesList: any[] = [];
  constructor(
    public http: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private _toastr: Toastr,
    public router: Router,
    public _helper: Helper
  ) {
    this.questionObj.question_type = 'main';
    this.questionObj.is_active = true;
    this.questionObj.is_multi_select = false;
    this.questionObj.category = '';
    this.questionObj.consultation_health_conditions = [];
    this.questionObj.states = [];
    this.questionObj.dtc_medicine_kits = [];
    this.choiceObj = {
      'text': '',
      'result': '',
      'consent_msg': '',
      'is_active': true,
      'has_file_upload': false,
      'has_subquestions': false,
      'sub_questions': []
    };
    this.createForm();
  }

  ngOnInit() {
    this.getMedicineKitList();
    this.getAllHealthConditionList();
    this.getStateList();
  }
  get dtc_medicine_kits() { return this.addQuestion.get('dtc_medicine_kits'); }
  get text() { return this.addQuestion.get('text'); }
  get category() { return this.addQuestion.get('category'); }
  get states() { return this.addQuestion.get('states'); }
  get consultation_health_conditions() { return this.addQuestion.get('consultation_health_conditions'); }
  get is_multi_select() { return this.addQuestion.get('is_multi_select'); }
  get is_active() { return this.addQuestion.get('is_active'); }

  get choices(): FormGroup {
    return new FormGroup({
      'text': new FormControl(null, [Validators.required]),
      'result': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'has_file_upload': new FormControl(null, []),
      'consent_message': new FormControl(null, []),
      'has_subquestions': new FormControl(null, []),
      'sub_questions': this.formBuilder.array([])
    });
  }

  get notSelectedStates(): any {
    if (this.statesList) {
      return this.statesList.filter(({ id: a }) => !this.addQuestion.get('states')?.value.some((b: any) => b === a)).length;
    }
  }

  get notSelectedKits() {
    if (this.medicineKitList) {
      return this.medicineKitList.filter((data: any) => !this.addQuestion.get('dtc_medicine_kits')?.value.some((b: any) => b === data._id)).length;
    }
  }

  get notSelectedConditions() {
    return this.healthConditionsList.filter((data: any) => !this.addQuestion.get('consultation_health_conditions')?.value.some((b: any) => b === data._id)).length;
  }

  public handleCheckAll(event: any, flag: string) {
    if (flag == 'state') {
      if (event.checked) {
        this.questionObj.states = this.statesList.map(({ _id }) => _id);
      } else {
        this.questionObj.states = [];
      }
      this.addQuestion.get('states')?.patchValue(this.questionObj.states);
    } else if (flag == 'kit') {
      if (event.checked) {
        this.questionObj.dtc_medicine_kits = this.medicineKitList.map((data: any) => data._id);
      } else {
        this.questionObj.dtc_medicine_kits = [];
      }
      this.addQuestion.get('dtc_medicine_kits')?.patchValue(this.questionObj.dtc_medicine_kits);
    } else if (flag == 'consultation_health_conditions') {
      if (event.checked) {
        this.questionObj.consultation_health_conditions =  this.healthConditionsList.map((data:any) => data._id);
      } else {
        this.questionObj.consultation_health_conditions = [];
      }
      this.addQuestion.patchValue({ consultation_health_conditions: this.questionObj.consultation_health_conditions });
    }
  }


  get sub_questions(): FormGroup {
    return new FormGroup({
      'subquestion_question_text': new FormControl(null, [Validators.required]),
      'subquestion_is_active': new FormControl(null, []),
      'subquestion_option_type': new FormControl(null, []),
      'subquestion_choices': this.formBuilder.array([])
    });
  }

  choiceDataControls() {
    return (this.addQuestion.get('choices') as FormArray)['controls'];
  }

  choiceData() {
    return this.addQuestion.get('choices') as FormArray;
  }

  public getAllHealthConditionList() {
    const url = 'api/consultation_health_conditions/all';
    this.http.get(url)
      .subscribe((conditionsList: any) => {

        if (conditionsList != null) {
          this.healthConditionsList = conditionsList;
        } else {
          this.healthConditionsList = [];
        }
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }
  public getStateList() {
    this.http.get('api/system_states/all')
      .subscribe((data: any) => {
        this.statesList = data;
      }, err => {

      });
  }

  public getMedicineKitList() {
    this.medicineKitList = [];
    const url = 'api/medicine_kits/all';
    this.http.get(url)
      .subscribe((medicineKitList: any) => {
        if (medicineKitList != null) {
          this.medicineKitList = medicineKitList;
          this.questionObj.selectedKitId = 0;
        } else {
          this.medicineKitList = [];
        }
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

  createForm() {
    this.addQuestion = this.formBuilder.group({
      'question_type': new FormControl(this.questionObj.question_type),
      'dtc_medicine_kits': new FormControl(this.questionObj.dtc_medicine_kits),
      'consultation_health_conditions': new FormControl(this.questionObj.consultation_health_conditions),
      'text': new FormControl(this.questionObj.text, [Validators.required]),
      'category': new FormControl(this.questionObj.category, [Validators.required]),
      'states': new FormControl(this.questionObj.states),
      'is_multi_select': new FormControl(this.questionObj.is_multi_select),
      'is_active': new FormControl(this.questionObj.is_active),
      'choices': this.formBuilder.array([this.createChoice()])
    });
    this.addChoice();
  }
  createChoice(): FormGroup {
    return this.formBuilder.group({
      'text': ['', [Validators.required]],
      'result': ['', [Validators.required]],
      'consent_message': '',
      'is_active': true,
      'has_file_upload': false,
      'has_subquestions': false,
      'sub_questions': this.formBuilder.array([])
    });
  }
  addChoice(): void {
    this.choicesArr = this.addQuestion.get('choices') as FormArray;
    this.choicesArr.push(this.createChoice());
  }
  removeChoice(index: any) {
    this.choicesArr.removeAt(index);
  }

  choiceSubQuestions(choiceId: number): FormArray {
    return this.choiceData().at(choiceId).get("sub_questions") as FormArray
  }

  createSubQuestion(): FormGroup {
    return this.formBuilder.group({
      'subquestion_question_text': ['', [Validators.required]],
      'subquestion_is_active': true,
      'subquestion_option_type': 'input',
      'subquestion_choices': new FormArray([])
    });
  }

  addSubQuestion(choiseIndex: number): void {
    this.choiceSubQuestions(choiseIndex).push(this.createSubQuestion());
  }

  removeSubQuestion(choiseIndex: number, subQuestionIndex: number) {
    this.choiceSubQuestions(choiseIndex).removeAt(subQuestionIndex);
  }

  setSubQuestionOptionType(choiseIndex: number, subQuestionIndex: number, event: any) {
    if (event.value == 'input') {
      let subChoises = this.subChoiceData(choiseIndex, subQuestionIndex);
      for (let i = subChoises.length - 1; i >= 0; i--) {
        subChoises.removeAt(i);
      }
    } else {

      let subChoises = this.subChoiceData(choiseIndex, subQuestionIndex);
      for (let i = subChoises.length - 1; i >= 0; i--) {
        subChoises.removeAt(i);
      }

      this.subChoiceData(choiseIndex, subQuestionIndex).push(this.createChoice());
    }
  }

  /* functions for choises of subquestion */
  subChoiceData(parentChoiceId: number, subquestionId: number) {
    return this.choiceSubQuestions(parentChoiceId).at(subquestionId).get('subquestion_choices') as FormArray;
  }

  subChoiceDataControls(parentChoiceId: number, subquestionId: number) {
    return (this.choiceSubQuestions(parentChoiceId).at(subquestionId).get('subquestion_choices') as FormArray)['controls'];
  }

  addSubChoice(parentChoiceId: number, subquestionId: number): void {
    this.subChoiceData(parentChoiceId, subquestionId).push(this.createChoice());
  }

  removeSubChoice(parentChoiceId: number, subquestionId: number, choiseIndex: number) {
    this.subChoiceData(parentChoiceId, subquestionId).removeAt(choiseIndex);
  }

  public saveQuestion(formValues: any) {
    let hasError = false;
    if (this.addQuestion.invalid) {
      this._helper.markFormGroupTouched(this.addQuestion);
      return;
    }
    const url = 'api/questions/create';
    const req = formValues.value;

    this.http.post(url, req).subscribe((data: any) => {
      if (data != null) {
        if (data.status == 'success') {
          this._toastr.showSuccess('Save Successfully');
          this.addQuestion.reset();
          this.router.navigate(['admin', 'questions', 'questions-list']);
          this._changeDetectorRef.detectChanges();
        } else {
          hasError = true;
          this._toastr.showError('Oops Something Went Wrong!');
        }
      }
    },
      err => {
        this._toastr.showError('Unable to save question');
        this._changeDetectorRef.detectChanges();
      }
    );
  }
  setConsentMsgValidator() {
    let result;
    let choiceControl: any = (this.addQuestion.get('choices') as FormArray)['controls'];
    choiceControl.forEach((controls: any) => {
      result = controls.value.result;
      if (result == '1') {
        controls.controls['consent_message'].enable();
        controls.controls['consent_message'].setValidators([Validators.required]);
        controls.controls['consent_message'].updateValueAndValidity();
      } else {
        controls.controls['has_subquestions'].patchValue(false);
        while (controls.controls['sub_questions'].length) {
          controls.controls['sub_questions'].removeAt(0);
        }
        controls.controls['consent_message'].setValue('');
        controls.controls['consent_message'].disable();
        controls.controls['consent_message'].clearValidators();
        controls.controls['consent_message'].updateValueAndValidity();
      }
      this.addQuestion.updateValueAndValidity();
    });
  }
}
