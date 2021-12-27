import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { DrugFormAddEditModalService } from './drugform-add-edit-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-drugform-add-edit-modal',
  templateUrl: './drugform-add-edit-modal.component.html',
  styleUrls: ['./drugform-add-edit-modal.component.scss']
})
export class DrugFormAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  drugForm: FormGroup;

  constructor(
    private _helper:Helper,
    private http: HttpClient,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _drugFormAddEditModalService: DrugFormAddEditModalService
  ) {

    this.drugForm = this.formBuilder.group({
      'id':new FormControl(null),
      'name': new FormControl(null, [Validators.required]),
      'singular':new FormControl(null,[Validators.required]),
      'plural':new FormControl(null,[Validators.required])
    });
  }

  get id() { return this.drugForm.get('id'); }
  get name() { return this.drugForm.get('name'); }
  get singular(){return this.drugForm.get('singular');}
  get plural(){return this.drugForm.get('plural');}

  ngOnInit(): void {
    let details = this._drugFormAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.drugForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        singular:details.data.singular,
        plural:details.data.plural
      });
    }
  }

  async saveDrugForm(formValid:boolean){
    if(formValid){
      const formData: any = this.drugForm.value;
      if(this.modalEvent == 'ADD'){
        let created = await this._drugFormAddEditModalService.addNewDrugForm(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._drugFormAddEditModalService.editDrugForm(this.drugForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.drugForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.drugForm);
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }
}
