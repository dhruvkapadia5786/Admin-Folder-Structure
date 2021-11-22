import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { TreatmentConditionAddEditModalService } from './treatment-condition-add-edit-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-treatment-condition-add-edit-modal',
  templateUrl: './treatment-condition-add-edit-modal.component.html',
  styleUrls: ['./treatment-condition-add-edit-modal.component.scss']
})
export class TreatmentConditionAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  treatmentConditionForm: FormGroup;

  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _tcAddEditModalService: TreatmentConditionAddEditModalService
  ) {
    this.treatmentConditionForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'description': new FormControl(null, []),
      'image_url': new FormControl(null, []),
      'faqs':new FormArray([]),
      'attributes':new FormArray([])
    });
  }

  get id() { return this.treatmentConditionForm.get('id'); }
  get name() { return this.treatmentConditionForm.get('name'); }
  get is_active() { return this.treatmentConditionForm.get('is_active'); }
  get description() { return this.treatmentConditionForm.get('description'); }
  get image_url() { return this.treatmentConditionForm.get('image_url'); }

  ngOnInit(): void {
    let details = this._tcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.treatmentConditionForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        is_active:details.data.is_active,
        description:details.data.description
      });
      this.imageUrl = details.data.image_url ? environment.api_url + details.data.image_url : `../../../../../assets/img/no_preview.png`;
      const faqsControl = this.treatmentConditionForm.get('faqs') as FormArray;
      if(details.data.faqs){
        details.data.faqs.forEach((item:any)=>{
          let faqFormGroup = new FormGroup({
            'question':new FormControl(item.question, [Validators.required]),
            'answer':new FormControl(item.answer, [Validators.required]),
            'sequence':new FormControl(item.sequence)
          });
          faqsControl.push(faqFormGroup);
        });
      }
      const attributesControl = this.treatmentConditionForm.get('attributes') as FormArray;
      if(details.data.attributes){
        details.data.attributes.forEach((item:any)=>{
          let attrFormGroup = new FormGroup({
            'name':new FormControl(item.name, [Validators.required]),
            'value':new FormControl(item.value, [Validators.required]),
            'sequence':new FormControl(item.sequence)
          });
          attributesControl.push(attrFormGroup);
        });
      }
    }
  }


  /*-----------------------------FAQ --------------------------------*/
  addFAQInput(){
    this.faqs().push(this.newFAQInput());
  }

  newFAQInput(): FormGroup {
    let length= this.faqs().length;
    return new FormGroup({
      'question': new FormControl('', [Validators.required]),
      'answer': new FormControl('', [Validators.required]),
      'sequence':new FormControl(length+1, []),
    });
  }

  removeFAQInput(empIndex:number) {
    this.faqs().removeAt(empIndex);
  }

  faqs(): FormArray {
      return this.treatmentConditionForm.get("faqs") as FormArray
  }
  /*-----------------------------END OF FAQ --------------------------------*/


  /*-----------------------------ATTRIBUTES --------------------------------*/
  addAttributeInput(){
    this.attributes().push(this.newAttributeInput());
  }

  newAttributeInput(): FormGroup {
    let attr_length= this.attributes().length;
    return new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'value': new FormControl('', [Validators.required]),
      'sequence':new FormControl(attr_length+1, []),
    });
  }

  removeAttributeInput(empIndex:number) {
    this.attributes().removeAt(empIndex);
  }

  attributes(): FormArray {
      return this.treatmentConditionForm.get("attributes") as FormArray
  }
  /*-----------------------------END OF ATTRIBUTES --------------------------------*/


  async saveTreatmentCondition(formValid:boolean){
    if(formValid){
      const formData: FormData = new FormData();
      formData.append('name', this.treatmentConditionForm.value.name);
      formData.append('description', this.treatmentConditionForm.value.description);
      formData.append('image_url', this.selectedImageFile);
      formData.append('is_active', this.treatmentConditionForm.value.is_active);

      if(this.modalEvent == 'ADD') {
        let create = await  this._tcAddEditModalService.addNewTreatmentCondition(formData);
      } else if (this.modalEvent == 'EDIT') {
        let update = await  this._tcAddEditModalService.editTreatmentCondition(this.treatmentConditionForm.value.id,formData);
      }

      this.onEventCompleted.emit(true);
      this.closeModal();
      this.treatmentConditionForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.treatmentConditionForm);
    }
  }


  onFileChange(event:any, type: string) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (type == 'IMAGE') {
          this.imageUrl = reader.result;
          this.selectedImageFile = file;
        }
        this._changeDetectorRef.markForCheck();
      }
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }
}
