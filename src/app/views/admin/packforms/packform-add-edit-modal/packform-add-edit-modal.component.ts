import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { PackformAddEditModalService } from './packform-add-edit-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-packform-add-edit-modal',
  templateUrl: './packform-add-edit-modal.component.html',
  styleUrls: ['./packform-add-edit-modal.component.scss']
})
export class PackformAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  packformForm: FormGroup;

  constructor(
    private _helper:Helper,
    private http: HttpClient,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _packformAddEditModalService: PackformAddEditModalService
  ) {

    this.packformForm = this.formBuilder.group({
      'id':new FormControl(null),
      'name': new FormControl(null, [Validators.required])
    });
  }

  get id() { return this.packformForm.get('id'); }
  get name() { return this.packformForm.get('name'); }

  ngOnInit(): void {
    let details = this._packformAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.packformForm.patchValue({
        id:details.data._id,
        name:details.data.name
      });
    }
  }

  async savePackform(formValid:boolean){
    if(formValid){
      const formData: any = this.packformForm.value;
      if(this.modalEvent == 'ADD'){
        let created = await this._packformAddEditModalService.addNewPackform(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._packformAddEditModalService.editPackform(this.packformForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.packformForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.packformForm);
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }
}
