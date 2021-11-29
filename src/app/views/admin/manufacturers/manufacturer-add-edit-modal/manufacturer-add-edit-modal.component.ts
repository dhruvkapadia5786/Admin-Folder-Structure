import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ManufacturerAddEditModalService } from './manufacturer-add-edit-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manufacturer-add-edit-modal',
  templateUrl: './manufacturer-add-edit-modal.component.html',
  styleUrls: ['./manufacturer-add-edit-modal.component.scss']
})
export class ManufacturerAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  manufacturerForm: FormGroup;

  constructor(
    private _helper:Helper,
    private http: HttpClient,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _manufacturerAddEditModalService: ManufacturerAddEditModalService){
    this.manufacturerForm = this.formBuilder.group({
      'id':new FormControl(null),
      'name': new FormControl(null, [Validators.required]),
      'address':new FormControl(null,[]),
      'contact_number':new FormControl(null,[]),
      'is_active':new FormControl(null)
    });
  }

  get id() { return this.manufacturerForm.get('id'); }
  get name() { return this.manufacturerForm.get('name'); }
  get is_active(){return this.manufacturerForm.get('is_active');}
  get address(){return this.manufacturerForm.get('address');}
  get contact_number(){return this.manufacturerForm.get('contact_number');}

  ngOnInit(): void {
    let details = this._manufacturerAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.manufacturerForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        address:details.data.address,
        contact_number:details.data.contact_number,
        is_active:details.data.is_active
      });
    }
  }


  async saveManufacturer(formValid:boolean){
    if(formValid){
      const formData: any = this.manufacturerForm.value;
      if(this.modalEvent == 'ADD'){
        let created = await this._manufacturerAddEditModalService.addNewManufacturer(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._manufacturerAddEditModalService.editManufacturer(this.manufacturerForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.manufacturerForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.manufacturerForm);
    }
  }

  closeModal(){
    this._bsModalRef.hide();
  }
}
