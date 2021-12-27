import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { TherapyAddEditModalService } from './therapy-add-edit-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-therapy-add-edit-modal',
  templateUrl: './therapy-add-edit-modal.component.html',
  styleUrls: ['./therapy-add-edit-modal.component.scss']
})
export class TherapyAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  therapyForm: FormGroup;

  constructor(
    private _helper:Helper,
    private http: HttpClient,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _therapyAddEditModalService: TherapyAddEditModalService
  ) {

    this.therapyForm = this.formBuilder.group({
      'id':new FormControl(null),
      'name': new FormControl(null, [Validators.required])
    });
  }

  get id() { return this.therapyForm.get('id'); }
  get name() { return this.therapyForm.get('name'); }

  ngOnInit(): void {
    let details = this._therapyAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.therapyForm.patchValue({
        id:details.data._id,
        name:details.data.name
      });
    }
  }

  async saveTherapy(formValid:boolean){
    if(formValid){
      const formData: any = this.therapyForm.value;
      if(this.modalEvent == 'ADD'){
        let created = await this._therapyAddEditModalService.addNewTherapy(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._therapyAddEditModalService.editTherapy(this.therapyForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.therapyForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.therapyForm);
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }
}
