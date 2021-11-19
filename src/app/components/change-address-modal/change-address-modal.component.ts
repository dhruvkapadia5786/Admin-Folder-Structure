import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';
import {ChangeAddressModalService} from './change-address-modal.service';

@Component({
  selector: 'app-change-address-modal',
  templateUrl: './change-address-modal.component.html',
  styleUrls: ['./change-address-modal.component.scss']
})
export class ChangeAddressModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  modalType: any;
  modalTitle: any;
  addressForm:FormGroup;
  states:any[]=[];

  constructor(
    private _bsModalRef:BsModalRef,
    private http: HttpClient,
    private _toastr:Toastr,
    private _changeAddressModalService:ChangeAddressModalService) {
    this.addressForm = new FormGroup({
      user_id:new FormControl(null),
      address_line_1: new FormControl(null, [Validators.required]),
      address_line_2: new FormControl(null),
      city_name: new FormControl(null, [Validators.required]),
      state_id: new FormControl(null, [Validators.required]),
      state_name: new FormControl(null, [Validators.required]),
      state_abbreviation: new FormControl(null, [Validators.required]),
      zip_code: new FormControl(null, [Validators.required]),
    });
  }

  get user_id() { return this.addressForm.get('user_id'); }
  get address_line_1() { return this.addressForm.get('address_line_1'); }
  get address_line_2() { return this.addressForm.get('address_line_2'); }
  get city_name() { return this.addressForm.get('city_name'); }
  get state_id() { return this.addressForm.get('state_id'); }
  get state_name() { return this.addressForm.get('state_name'); }
  get state_abbreviation() { return this.addressForm.get('state_abbreviation'); }
  get zip_code() { return this.addressForm.get('zip_code'); }

  ngOnInit(): void {
    this._getState();
    let details = this._changeAddressModalService.getFormData();
    this.modalType = details.type;
    this.modalTitle = details.addressModalTitle;

    if (this.modalType == 'EDIT_ADDRESS') {
      this.addressForm.patchValue({
        user_id:details.user_id,
        address_line_1: details.address_line_1,
        address_line_2: details.address_line_2?details.address_line_2:'',
        city_name: details.city_name,
        state_id: details.state_id,
        state_name: details.state_name,
        state_abbreviation: details.state_abbreviation,
        zip_code: details.zip_code
      });
    } else {
      this.addressForm.patchValue({
        user_id:details.user_id
      })
    }
  }

  closeModal(){
    this._bsModalRef.hide()
  }

  _getState(){
    const url = 'api/v1/address/states/all';
    this.http.get(url).subscribe((data:any) => {
      this.states = data;
    }, (err:any) => {});
  }



  getStateNameFromId(state_id:number){
    let stateFound =  this.states.find((state:any)=>state.id == state_id);
    return stateFound && stateFound.name ? stateFound.name:'Florida';
  }

  setStateInfo(event:any){
    let stateFound =  this.states.find((state:any)=>state.id == event.target.value);
    this.addressForm.patchValue({
      state_name: stateFound.name,
      state_abbreviation: stateFound.abbreviation
    });
  }


  validateShippingAddress(): Promise<boolean> {

    let state_name= this.getStateNameFromId(this.addressForm.value.state_id);
    let ValidationAddress = {
      address_line1: this.addressForm.value.address_line_1,
      city_locality: this.addressForm.value.city,
      company_name: '',
      country_code: 'US',
      postal_code: this.addressForm.value.zip_code,
      state_province: state_name
    };
    const url = 'api/v1/address/validateShippingAddress';
    let isValid = false;
    const obj = {
      address: [ValidationAddress]
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, obj).subscribe((data: any) => {
          if (data[0].status === 'verified') {
            isValid = true;
            resolve(isValid);
          } else if (data[0].status === 'unverified') {
            isValid = false;
            this._toastr.showError('Shipping Address is not verified');
            reject(isValid);
          } else {
            isValid = false;
            this._toastr.showError('Shipping Address is invalid');
            reject(isValid);
          }
        },
        (err:any) => {
          isValid = false;
          this._toastr.showError('Shipping Address is invalid');
          reject(isValid);
        });
    });
  }

  saveUserAddress(valid:boolean){
    if(valid){
        this.validateShippingAddress().then((res:any) => {
          if(res){
            this.onEventCompleted.emit(this.addressForm.value);
            return true;
          }else{
            return false;
          }
        });
      return true;
    }else{
      return false;
    }
  }

}
