import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ContactLensesColorAddEditModalService } from './contactlenses-color-add-edit-modal.service';

@Component({
  selector: 'app-contactlenses-color-add-edit-modal',
  templateUrl: './contactlenses-color-add-edit-modal.component.html',
  styleUrls: ['./contactlenses-color-add-edit-modal.component.scss']
})
export class ContactlensesColorAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  colorForm: FormGroup;

  imageUrl: any = '../../../../../assets/img/no_preview.png';

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _lensColorAddEditModalService: ContactLensesColorAddEditModalService
  ) {
    this.colorForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, [])
    });
  }

  get id() { return this.colorForm.get('id'); }
  get name() { return this.colorForm.get('name'); }
  get is_active() { return this.colorForm.get('is_active'); }

  ngOnInit(): void {
    let details = this._lensColorAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.colorForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        is_active:details.data.is_active
      });
    }
  }


  async saveColor(formValid:boolean){
    if(formValid){
      if(this.modalEvent == 'ADD'){
        let create = await  this._lensColorAddEditModalService.addNewColor(this.colorForm.value);
      } else if (this.modalEvent == 'EDIT'){
        let update = await  this._lensColorAddEditModalService.editColor(this.colorForm.value.id,this.colorForm.value);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.colorForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.colorForm);
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }

}
