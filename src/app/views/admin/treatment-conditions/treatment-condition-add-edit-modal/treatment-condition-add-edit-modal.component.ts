import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { TreatmentConditionAddEditModalService } from './treatment-condition-add-edit-modal.service';

@Component({
  selector: 'app-treatment-condition-add-edit-modal',
  templateUrl: './treatment-condition-add-edit-modal.component.html',
  styleUrls: ['./treatment-condition-add-edit-modal.component.scss']
})
export class TreatmentConditionAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  healthConditionForm: FormGroup;

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _hcAddEditModalService: TreatmentConditionAddEditModalService
  ) {
    this.healthConditionForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, [])
    });
  }

  get id() { return this.healthConditionForm.get('id'); }
  get name() { return this.healthConditionForm.get('name'); }
  get is_active() { return this.healthConditionForm.get('is_active'); }

  ngOnInit(): void {
    let details = this._hcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.healthConditionForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        is_active:details.data.is_active
      });
    }
  }

  async saveHealthCondition(formValid:boolean){
    if(formValid){
      const formData: any = this.healthConditionForm.value;
      if(this.modalEvent == 'ADD'){
        let created= await this._hcAddEditModalService.addNewHealthCondition(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._hcAddEditModalService.editHealthCondition(this.healthConditionForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.healthConditionForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.healthConditionForm);
    }
  }
  closeModal(){
    this._bsModalRef.hide();
  }
}
