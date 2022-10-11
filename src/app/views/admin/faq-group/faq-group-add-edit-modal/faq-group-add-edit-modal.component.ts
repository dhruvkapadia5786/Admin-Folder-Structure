import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { FAQGroupAddEditModalService } from './faq-group-add-edit-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-faq-group-add-edit-modal',
  templateUrl: './faq-group-add-edit-modal.component.html',
  styleUrls: ['./faq-group-add-edit-modal.component.scss']
})
export class FAQGroupAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  manufacturerForm: FormGroup;

  constructor(
    private _helper:Helper,
    private http: HttpClient,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _manufacturerAddEditModalService: FAQGroupAddEditModalService){
    this.manufacturerForm = this.formBuilder.group({
      'id':new FormControl(null),
      'name': new FormControl(null, [Validators.required]),
      'heading':new FormControl(null,[]),
      'subheading':new FormControl(null,[]),
    });
  }

  get id() { return this.manufacturerForm.get('id'); }
  get name() { return this.manufacturerForm.get('name'); }
  get heading(){return this.manufacturerForm.get('heading');}
  get subheading(){return this.manufacturerForm.get('subheading');}

  ngOnInit(): void {
    let details = this._manufacturerAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.manufacturerForm.patchValue({
        id:details.data.id,
        name:details.data.name,
        heading:details.data.heading,
        subheading:details.data.subheading
      });
    }
  }


  async saveManufacturer(formValid:boolean){
    if(formValid){
      const formData: any = this.manufacturerForm.value;
      if(this.modalEvent == 'ADD'){
        let created = await this._manufacturerAddEditModalService.addNewFAQGroup(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._manufacturerAddEditModalService.editFAQGroup(this.manufacturerForm.value.id,formData);
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