import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { AttributesAddEditModalService } from './attributes-add-edit-modal.service';

@Component({
  selector: 'app-attributes-add-edit-modal',
  templateUrl: './attributes-add-edit-modal.component.html',
  styleUrls: ['./attributes-add-edit-modal.component.scss']
})
export class AttributesAddEditModalComponent implements OnInit {
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
    private _tcAddEditModalService: AttributesAddEditModalService
  ) {
    this.treatmentConditionForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
    });
  }

  get id() { return this.treatmentConditionForm.get('id'); }
  get name() { return this.treatmentConditionForm.get('name'); }
  get is_active() { return this.treatmentConditionForm.get('is_active'); }

  ngOnInit(): void {
    let details = this._tcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.treatmentConditionForm.patchValue({
        id:details.data.id,
        name:details.data.name,
        is_active:details.data.is_active,
      });
    }
  }

  async saveTreatmentCondition(formValid:boolean){
    if(formValid){
      let categoryVal = this.treatmentConditionForm.value;  
      if(this.modalEvent == 'ADD'){
        let create = await  this._tcAddEditModalService.addNewCategories(categoryVal);
      } else if (this.modalEvent == 'EDIT'){
        let update = await  this._tcAddEditModalService.editCategories(categoryVal.id,categoryVal);
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
