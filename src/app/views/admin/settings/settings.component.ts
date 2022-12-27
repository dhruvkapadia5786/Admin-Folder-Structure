import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Toastr } from 'src/app/services/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  systemSettings:any;
  public shippingChargeSettings: FormGroup;

  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _http: HttpClient,
    public activeRoute: ActivatedRoute,
    public _helper: Helper
  ) {
    this.shippingChargeSettings = new FormGroup({
      'shipping_charge_active': new FormControl(null, []),
      'shipping_charges':new FormArray([]),
    });

   
  }

  get shipping_charge_active() { return this.shippingChargeSettings.get('shipping_charge_active'); };

  ngOnInit(){
    this.getSystemSettingsDetails();
  }

  newShippingCharge(): FormGroup {
    return new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'price': new FormControl('', [Validators.required])
    });
  }

  addShippingCharge() {
    this.shipping_charges().push(this.newShippingCharge());
  }

  removeShippingCharge(empIndex:number) {
    this.shipping_charges().removeAt(empIndex);
  }

  shipping_charges(): FormArray {
      return this.shippingChargeSettings.get("shipping_charges") as FormArray
  }

  getSystemSettingsDetails(){
    const url = 'api/system_settings/view' ;
    this._http.get(url).subscribe((data:any) => {
        this.systemSettings = data;

        this.shippingChargeSettings.patchValue({
          shipping_charge_active:data.shipping_charge_active
        });

        const shipping_chargesControl = this.shippingChargeSettings.get('shipping_charges') as FormArray;
        if(data.shipping_charges){
          data.shipping_charges.forEach((item:any)=>{
            let shFormGroup = new FormGroup({
              'name':new FormControl(item.name, [Validators.required]),
              'price':new FormControl(item.price, [Validators.required])
            });
            shipping_chargesControl.push(shFormGroup);
          });
        }
        this._changeDetectorRef.detectChanges();
      }, err => {
      });
  }

  public saveCharge() {
    if (this.shippingChargeSettings.invalid) {
      this._helper.markFormGroupTouched(this.shippingChargeSettings);
      return;
    }
    const url = 'api/system_settings/update_shipping_charge/'+this.systemSettings.id ;
    const req = this.shippingChargeSettings.value;
    this._http.post(url, req).subscribe((data: any) => {
      this._toastr.showSuccess('Shipping Charges updated Successfully');
    },
      err => {
        this._toastr.showError('Unable to update Setting');
      });
  }

  public forceLogoutAllUsers(){
    const url = 'api/users/forceLogoutAll';
    this._http.get(url).subscribe((data: any) => {
      this._toastr.showSuccess('All users logged out Successfully');
    },
    err => {
      this._toastr.showError('Error occured');
    });
  }



}
