import { ChangeDetectorRef, EventEmitter, Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { CountryAddEditModalService } from './country-add-edit-modal.service';

@Component({
  selector: 'app-country-add-edit-modal',
  templateUrl: './country-add-edit-modal.component.html',
  styleUrls: ['./country-add-edit-modal.component.scss']
})
export class CountryAddEditModalComponent implements OnInit {
  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();
  modalEvent: any;
  countryForm: FormGroup;

  constructor(
    private _helper:Helper,
    private _bsModalRef:BsModalRef,
    private formBuilder: FormBuilder,
    private _countryAddEditModalService: CountryAddEditModalService
  ) {
    this.countryForm = this.formBuilder.group({
      'id':new FormControl(null, []),
      'name': new FormControl(null, [Validators.required]),
      'code': new FormControl(null, [Validators.required]),
      'capital': new FormControl(null),
      'iso_code':new FormControl(null,[Validators.required]),
      'currency_code':new FormControl(null,[Validators.required]),
      'continent':new FormControl(null),
      'phone_code':new FormControl(null),
      'is_active':new FormControl(null)
    });
  }

  get id() { return this.countryForm.get('id'); }
  get name() { return this.countryForm.get('name'); }
  get capital() { return this.countryForm.get('capital'); }
  get code() { return this.countryForm.get('code'); }
  get iso_code(){return this.countryForm.get('iso_code');}
  get currency_code(){return this.countryForm.get('currency_code');}
  get continent(){return this.countryForm.get('continent');}
  get phone_code(){return this.countryForm.get('phone_code');}
  get is_active(){return this.countryForm.get('is_active');}

  ngOnInit(): void {
    let details = this._countryAddEditModalService.getData();
    this.modalEvent = details.event;
    if(details.event == 'EDIT'){
      this.countryForm.patchValue({
        id:details.data._id,
        name:details.data.name,
        capital: details.data.capital,
        code: details.data.code,
        iso_code:details.data.iso_code,
        currency_code:details.data.currency_code,
        continent:details.data.continent,
        phone_code:details.data.phone_code,
        is_active:details.data.is_active
      });
    }
  }

  async saveCountry(formValid:boolean){
    if(formValid){
      const formData: any = this.countryForm.value;
      if(this.modalEvent == 'ADD'){
        let created= await this._countryAddEditModalService.addNewCountry(formData);
      }else if(this.modalEvent == 'EDIT'){
        let updated =  await this._countryAddEditModalService.editCountry(this.countryForm.value.id,formData);
      }
      this.onEventCompleted.emit(true);
      this.closeModal();
      this.countryForm.reset();
    } else {
      this._helper.markFormGroupTouched(this.countryForm);
    }
  }
  closeModal(){
    this._bsModalRef.hide();
  }
}
