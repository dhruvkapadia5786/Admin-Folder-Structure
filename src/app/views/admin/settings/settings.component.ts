import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
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
 
  public shippingChargeSettings: FormGroup;

  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _http: HttpClient,
    public activeRoute: ActivatedRoute,
    public _helper: Helper
  ) { 
    this.shippingChargeSettings = new FormGroup({
      'amount': new FormControl(null, [Validators.required]),
    });
  }

  get amount() { return this.shippingChargeSettings.get('amount'); };

  ngOnInit(){
    this.getChargeDetails();
  }

  getChargeDetails() {
    const url = 'api/v1/new_orders/getShippingCharge' ;
    this._http.get(url)
      .subscribe((data:any) => {
        this.shippingChargeSettings.patchValue({amount:data.amount});
        this._changeDetectorRef.detectChanges();
      }, err => {
      });
  }

  public saveCharge() {
    if (this.shippingChargeSettings.invalid) {
      this._helper.markFormGroupTouched(this.shippingChargeSettings);
      return;
    }
    const url = 'api/v1/admin/update_shipping_charge' ;
    const req = this.shippingChargeSettings.value;
    this._http.post(url, req).subscribe((data: any) => {
      this._toastr.showSuccess('Shipping Charges updated Successfully');
    },
      err => {
        this._toastr.showError('Unable to update Setting');
      });
  }
}
