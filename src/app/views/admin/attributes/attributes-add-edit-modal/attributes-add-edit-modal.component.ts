import { EventEmitter, Component, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder, FormArray } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { AttributesAddEditModalService } from './attributes-add-edit-modal.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-attributes-add-edit-modal',
  templateUrl: './attributes-add-edit-modal.component.html',
  styleUrls: ['./attributes-add-edit-modal.component.scss']
})
export class AttributesAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  attributesForm: UntypedFormGroup;
  imageUrl: any = '../../../../../assets/img/no_preview.png';
  selectedImageFile: any
  attributeDetails:any;
  attributesData:any[]=[];

  constructor(
    private _http: HttpClient,
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: UntypedFormBuilder,
    private _changeDetectorRef:ChangeDetectorRef,
    private _tcAddEditModalService: AttributesAddEditModalService){

    this.attributesForm = this.formBuilder.group({
      'id':new UntypedFormControl(null, []),
      'name': new UntypedFormControl(null, [Validators.required]),
      'is_active': new UntypedFormControl(null, [])
    });
  }

  get id() { return this.attributesForm.get('id'); }
  get name() { return this.attributesForm.get('name'); }
  get is_active() { return this.attributesForm.get('is_active'); }

  ngOnInit(): void {
    let details = this._tcAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.getAttributeDetails(details.data.id);
    }
  }

  getAttributeDetails(id:number){
    const url = 'api/admin/attributes/view/'+id;
    this._http.get(url).subscribe((res: any) => {
      this.attributeDetails = res;
      this.patchFormValue();
    },(err) => {
      this.attributeDetails = null;
    });
  }

  patchFormValue(){
    this.attributesForm.patchValue({
      id:this.attributeDetails.id,
      name:this.attributeDetails.name,
      is_active:this.attributeDetails.is_active
    });
  }
 
  async saveAttribute(formValid:boolean){
    if(formValid){
      if(this.modalEvent == 'ADD'){
        let create = await  this._tcAddEditModalService.addNewAttributes(this.attributesForm.value);
      } else if (this.modalEvent == 'EDIT'){
        let update = await  this._tcAddEditModalService.editAttributes(this.attributesForm.value.id,this.attributesForm.value);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.attributesForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.attributesForm);
    }
  }

  
  closeModal(){
    this._bsModalRef.hide();
  }
}
