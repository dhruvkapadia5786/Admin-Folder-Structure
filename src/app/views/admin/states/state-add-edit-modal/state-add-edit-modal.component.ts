import { EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { StateAddEditModalService } from './state-add-edit-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-state-add-edit-modal',
  templateUrl: './state-add-edit-modal.component.html',
  styleUrls: ['./state-add-edit-modal.component.scss']
})
export class StateAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  stateForm: FormGroup;
  countryList: any[] = [];

  constructor(
    private _helper:Helper,
    private http: HttpClient,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _stateAddEditModalService: StateAddEditModalService
  ) {
    this.getCountryList()
    this.stateForm = this.formBuilder.group({
      'id':new FormControl(null),
      'country_id': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'abbreviation':new FormControl(null,[Validators.required,Validators.minLength(2),Validators.maxLength(2)]),
      'is_active':new FormControl(null)
    });
  }

  get id() { return this.stateForm.get('id'); }
  get country_id() { return this.stateForm.get('country_id'); }
  get name() { return this.stateForm.get('name'); }
  get is_active(){return this.stateForm.get('is_active');}
  get is_vcr(){return this.stateForm.get('is_vcr');}
  get otc_tax_percentage(){return this.stateForm.get('otc_tax_percentage');}
  get abbreviation(){return this.stateForm.get('abbreviation');}

  ngOnInit(): void {
    let details = this._stateAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.stateForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        country_id:details.data.country_id._id,
        abbreviation:details.data.abbreviation,
        is_active:details.data.is_active
      });
    }
  }

  getCountryList() {
    const url = 'api/system_countries/all';
    this.http.get(url).subscribe((data:any) => {
      this.countryList = data;
    }, (err) => { });
  }

  async saveState(formValid:boolean){
    if(formValid){
      const formData: any = this.stateForm.value;
      if(this.modalEvent == 'ADD'){
        let created = await this._stateAddEditModalService.addNewState(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._stateAddEditModalService.editState(this.stateForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.stateForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.stateForm);
    }
  }
  closeModal(){
    this._bsModalRef.hide();
  }
}
