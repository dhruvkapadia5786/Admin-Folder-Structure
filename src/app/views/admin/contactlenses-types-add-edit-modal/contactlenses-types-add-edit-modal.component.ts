import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ContactLensesTypesAddEditModalService } from './contactlenses-types-add-edit-modal.service';

@Component({
  selector: 'app-contactlenses-types-add-edit-modal',
  templateUrl: './contactlenses-types-add-edit-modal.component.html',
  styleUrls: ['./contactlenses-types-add-edit-modal.component.scss']
})
export class ContactlensesTypesAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  typeForm: FormGroup;

  imageUrl: any = '../../../../../assets/img/no_preview.png';

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _lensTypeAddEditModalService: ContactLensesTypesAddEditModalService
  ) {
    this.typeForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'description': new FormControl(null, []),
    });
  }

  get id() { return this.typeForm.get('id'); }
  get name() { return this.typeForm.get('name'); }
  get is_active() { return this.typeForm.get('is_active'); }
  get description() { return this.typeForm.get('description'); }

  ngOnInit(): void {
    let details = this._lensTypeAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.typeForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        is_active:details.data.is_active,
        description:details.data.description
      });
    }
  }


  async saveType(formValid:boolean){
    if(formValid){
      if(this.modalEvent == 'ADD'){
        let create = await  this._lensTypeAddEditModalService.addNewType(this.typeForm.value);
      } else if (this.modalEvent == 'EDIT'){
        let update = await  this._lensTypeAddEditModalService.editType(this.typeForm.value.id,this.typeForm.value);
      }

      this.onEventCompleted.emit(true);
      this.closeModal();
      this.typeForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.typeForm);
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }

}
