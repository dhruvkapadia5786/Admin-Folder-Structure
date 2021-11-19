import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { DoctorRegistrationCodeAddEditModalService } from './doctor-registration-code-add-edit-modal.service';

@Component({
  selector: 'app-doctor-registration-code-add-edit-modal',
  templateUrl: './doctor-registration-code-add-edit-modal.component.html',
  styleUrls: ['./doctor-registration-code-add-edit-modal.component.scss']
})
export class DoctorRegistrationCodeAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  selectedId!: any;
  modalEvent: any;
  addCodeForm: FormGroup;

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private _doctorRegistrationCodeService: DoctorRegistrationCodeAddEditModalService
  ) {
    this.addCodeForm = new FormGroup({
      'code': new FormControl(null, [Validators.required]),
      'created_for': new FormControl(null, [Validators.required]),
    });
  }

  get code() { return this.addCodeForm.get('code'); }
  get created_for() { return this.addCodeForm.get('created_for'); }

  ngOnInit(): void {
    let details = this._doctorRegistrationCodeService.getData();
    if(details.event=='EDIT'){
      this.selectedId = details.selectedId;
      this.addCodeForm.patchValue({...details.data});
    }
    this.modalEvent = details.event;
  }

  async saveCode(formValid: boolean){
    if (formValid){
      if (this.modalEvent == 'CREATE'){
        let created = await this.createCode(this.addCodeForm.value);
      } else {
        let updateData = this.addCodeForm.value;
        updateData._id = this.selectedId;
        let created = await this.updateCode(updateData);
      }
      this.addCodeForm.reset();
      this.onEventCompleted.emit(true);
      this.closeModal();
    } else {
      this._helper.markFormGroupTouched(this.addCodeForm);
      return;
    }
  }

  async createCode(data:any){
    return await this._doctorRegistrationCodeService.createCode(data);
  }

  async updateCode(data:any){
    return await this._doctorRegistrationCodeService.updateCode(data);
  }

  closeModal(){
    this._bsModalRef.hide();
  }

}
