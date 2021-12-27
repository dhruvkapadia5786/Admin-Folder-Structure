import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QuestionChoice } from '../../../../models/admin/AdminQuestion';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { QuestionCategory } from 'src/app/models/admin/QuestionCategory';
import { ToastrService } from 'ngx-toastr';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QuestionEditComponent implements OnInit {
  public questionObj!: any;
  public choiceObj!: QuestionChoice;
  public questionId: string;
  public activeCategories!: QuestionCategory[];

  public editQuestionFormGroup!: FormGroup;
  public choiceFormGroup!: FormGroup;
  public healthConditionsList: any = [];
  public flowTypeList: any = [
    { type: 'Order', value: 'ORDER' },
    { type: 'Consultation', value: 'CONSULTATION' },
    { type: 'General', value: 'GENERAL' }
  ]

  public choiceError = false;
  public medicineKitList: any;
  public statesList: any = [];
  public selectedMedicineKit: any = [];
  public selectedHealthCondition: any = [];
  public selectedStates: any = [];
  constructor(
    public http: HttpClient,
    public cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    public toaster: ToastrService,
    public router: Router,
    private _toastr: Toastr,
    private formBuilder: FormBuilder
  ) {
    this.questionId = this.route.snapshot.paramMap.get('id') || '';
    this.initializeFormGroup();
  }

  ngOnInit() {
    this.getAllMedicineKitList();
    this.getAllHealthConditionList();
    this.getStateList();
    this.getQuestion();
  }

  get notSelectedStates(): any {
    if (this.statesList) {
      return this.statesList.filter((data: any) => !this.editQuestionFormGroup.get('states')?.value.some((b: any) => b === data._id)).length;
    }
  }

  get notSelectedKits() {
    if (this.medicineKitList) {
      return this.medicineKitList.filter((data: any) => !this.editQuestionFormGroup.get('dtc_medicine_kits')?.value.some((b: any) => b === data._id)).length;
    }
  }

  get notSelectedConditions() {
    return this.healthConditionsList.filter((data: any) => !this.editQuestionFormGroup.get('consultation_health_conditions')?.value.some((b: any) => b === data._id)).length;
  }

  public handleCheckAll(event: any, flag: string) {
    if (flag == 'state') {
      if (event.checked) {
        this.questionObj.states = this.statesList.map((data:any) => data._id);
      } else {
        this.questionObj.states = [];
      }
      this.editQuestionFormGroup.get('states')?.patchValue(this.questionObj.states);
    } else if (flag == 'kit') {
      if (event.checked) {
        this.questionObj.dtc_medicine_kits = this.medicineKitList.map((data: any) => data._id);

      } else {
        this.questionObj.dtc_medicine_kits = [];
      }
      this.editQuestionFormGroup.get('dtc_medicine_kits')?.patchValue(this.questionObj.dtc_medicine_kits);
    } else if (flag == 'consultation_health_conditions') {
      if (event.checked) {
        this.questionObj.consultation_health_conditions =  this.healthConditionsList.map((data:any) => data._id);
      } else {
        this.questionObj.consultation_health_conditions = []
      }
      this.editQuestionFormGroup.get('consultation_health_conditions')?.patchValue(this.questionObj.consultation_health_conditions);
    }
  }

  /**
   * Initialize FormGroup for Validation
   */
  public initializeFormGroup() {
    this.editQuestionFormGroup = new FormGroup({
      'question_type': new FormControl('main', [Validators.required]),
      'dtc_medicine_kits': new FormControl(null),
      'consultation_health_conditions': new FormControl(null),
      'text': new FormControl(null, [Validators.required]),
      'category': new FormControl('', [Validators.required]),
      'states': new FormControl(null),
      'is_multi_select': new FormControl(null, []),
      'is_active': new FormControl(null, []),
      'choices': new FormArray([])
    });
    this.choiceFormGroup = new FormGroup({
      'text': new FormControl(null, [Validators.required]),
      'result': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'has_file_upload': new FormControl(null, []),
      'consent_message': new FormControl(null, []),
      'has_subquestions': new FormControl(null, []),
      'sub_questions': this.formBuilder.array([])
    });
  }

  /**
   * GETTERS FOR VALIDATION MESSAGES
   */
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

  get sub_questions(): FormGroup {
    return new FormGroup({
      'subquestion_question_text': new FormControl(null, [Validators.required]),
      'subquestion_is_active': new FormControl(null, []),
      'subquestion_option_type': new FormControl(null, []),
      'subquestion_choices': this.formBuilder.array([])
    });
  }

  get dtc_medicine_kits() { return this.editQuestionFormGroup.get('dtc_medicine_kits'); }
  get consultation_health_conditions() { return this.editQuestionFormGroup.get('consultation_health_conditions'); }
  get text() { return this.editQuestionFormGroup.get('text'); }
  get category() { return this.editQuestionFormGroup.get('category'); }
  get question_type() { return this.editQuestionFormGroup.get('question_type'); }
  get states() { return this.editQuestionFormGroup.get('states'); }

  /**
   * Adds new empty choice form control to Choices Array
   */
  public addNewChoice() {
    const choiceControl = this.editQuestionFormGroup.get('choices') as FormArray;
    choiceControl.push(this.choices);
    this.hasChoiceLengthError();
  }

  /**
   * Removes Choice at given index from Choices Array
   * @param index index of choice to be removed
   */
  public removeChoice(index: number) {
    const choiceControl = this.editQuestionFormGroup.get('choices') as FormArray;
    choiceControl.removeAt(index);
    this.hasChoiceLengthError();
  }

  public hasChoiceLengthError() {
    const choiceControl = this.editQuestionFormGroup.get('choices') as FormArray;
    if (choiceControl.length < 1) {
      this.choiceError = true;
    } else {
      this.choiceError = false;
    }
    return this.choiceError;
  }

  choiceData() { return this.editQuestionFormGroup.get('choices') as FormArray; }

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

  addSubQuestion(choiseIndex: number) {
    this.choiceSubQuestions(choiseIndex).push(this.createSubQuestion());
  }

  removeSubQuestion(choiseIndex: number, subQuestionIndex: number) {
    this.choiceSubQuestions(choiseIndex).removeAt(subQuestionIndex);
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

  /* functions for choises of subquestion */
  subChoiceData(parentChoiceId: number, subquestionId: number) {
    return this.choiceSubQuestions(parentChoiceId).at(subquestionId).get('subquestion_choices') as FormArray;
  }

  subChoiceDataControls(parentChoiceId: number, subquestionId: number) {
    return (this.choiceSubQuestions(parentChoiceId).at(subquestionId).get('subquestion_choices') as FormArray)['controls'];
  }

  getChoiceDataControls() {
    return (this.editQuestionFormGroup.get('choices') as FormArray)['controls'];
  }

  addSubChoice(parentChoiceId: number, subquestionId: number): void {
    this.subChoiceData(parentChoiceId, subquestionId).push(this.createChoice());
  }

  removeSubChoice(parentChoiceId: number, subquestionId: number, choiseIndex: number) {
    this.subChoiceData(parentChoiceId, subquestionId).removeAt(choiseIndex);
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

  /**
   * Retrieves Question Details to be edited
   */
  public getQuestion() {
    const url = 'api/questions/view/' + this.questionId;
    this.http.get(url)
      .subscribe((data: any) => {
        this.questionObj = data;
        /* patch values to form group */
        this.editQuestionFormGroup.patchValue({
          question_type: data.question_type,
          dtc_medicine_kits: data.dtc_medicine_kits.map((kit: any) => kit._id),
          consultation_health_conditions: data.consultation_health_conditions.map((CHC: any) => CHC._id),
          text: data.text,
          category: data.category,
          states: data.states.map((state: any) => state._id),
          is_multi_select: data.is_multi_select,
          is_active: data.is_active
        })

        /* patch choices to form group */
        this.questionObj.choices?.forEach((choice: any) => {
          let choiceControl = this.editQuestionFormGroup.get('choices') as FormArray;
          let subQuestionsArray = this.formBuilder.array([]);
          if (choice.has_subquestions) {
            choice.sub_questions?.forEach((sq: any) => {
                let subQuestionsChoisesArray = this.formBuilder.array([]);

                if (sq.subquestion_option_type == 'choise' && sq.subquestion_choices.length > 0) {
                  sq.subquestion_choices.forEach((sqc: any) => {
                    let subQChoise = new FormGroup({
                      'text': new FormControl(sqc.text, [Validators.required]),
                      'result': new FormControl(sqc.result, [Validators.required]),
                      'is_active': new FormControl(sqc.is_active, []),
                      'has_file_upload': new FormControl(sqc.has_file_upload, []),
                      'consent_message': new FormControl(sqc.consent_message, []),
                      'has_subquestions': new FormControl(sqc.has_subquestions, []),
                      'sub_questions': this.formBuilder.array([])
                    });
                    subQuestionsChoisesArray.push(subQChoise);
                  });
                }

                let subQ = new FormGroup({
                  'subquestion_question_text': new FormControl(sq.subquestion_question_text, [Validators.required]),
                  'subquestion_is_active': new FormControl(sq.subquestion_is_active, []),
                  'subquestion_option_type': new FormControl(sq.subquestion_option_type, []),
                  'subquestion_choices': subQuestionsChoisesArray
                });
                subQuestionsArray.push(subQ);
            });
          }
          const cControl = new FormGroup({
            'text': new FormControl(choice.text, [Validators.required]),
            'result': new FormControl(choice.result, [Validators.required]),
            'is_active': new FormControl(choice.is_active, []),
            'has_file_upload': new FormControl(choice.has_file_upload, []),
            'consent_message': new FormControl(choice.consent_message, []),
            'has_subquestions': new FormControl(choice.has_subquestions, []),
            'sub_questions': subQuestionsArray
          });
          this.choiceResultChanged(cControl);
          choiceControl.push(cControl);
        });
      }, err => {

      });
    this.cdr.detectChanges();
  }

  public getStateList() {
    this.http.get('api/system_states/all')
      .subscribe((data: any) => {
        this.statesList = data;
      }, err => {
      });
  }

  getAllMedicineKitList() {
    this.medicineKitList = [];
    const url = 'api/medicine_kits/all';
    this.http.get(url)
      .subscribe((medicineKitList: any) => {
        if (medicineKitList != null) {
          this.medicineKitList = medicineKitList;
        } else {
          this.medicineKitList = [];
        }
        this.cdr.detectChanges();
      }, err => {

      });
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
      }, err => {

      });
  }

  /**
   * Updates validators for Choice Consent Message Field
   * @param choiceControl Modified choice form control
   */
  public choiceResultChanged(choiceControl: AbstractControl) {
    const result = choiceControl.get('result')?.value;
    if (result == 1) {
      choiceControl.get('consent_message')?.setValidators(Validators.required);
    } else {
      choiceControl.get('consent_message')?.setErrors(null);
      choiceControl.get('consent_message')?.clearValidators();
    }
    choiceControl.updateValueAndValidity();
  }

  /**
   * Updates question details
   */
  public updateQuestion() {
    if (this.hasChoiceLengthError() || this.editQuestionFormGroup.invalid) {
      this.markFormGroupTouched(this.editQuestionFormGroup);
      return;
    }

    let body =  this.editQuestionFormGroup.value
    const url = 'api/questions/update/' + this.questionId;
    this.http.post(url, body)
      .subscribe((data: any) => {
        if (data != null) {
          this.toaster.success('Question Details Updated Successfully');
          this.router.navigate(['admin', 'questions', 'questions-list']);
        }
      }, err => {
        this.toaster.error('Unable to update question details. Please Try Again!');
      });
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
