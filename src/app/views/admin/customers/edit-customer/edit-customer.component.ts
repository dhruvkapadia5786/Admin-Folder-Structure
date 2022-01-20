import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from '../../../../services/helper.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent implements OnInit {
  editPatient: FormGroup;
  customerLoaded=false;
  customerId: string;
  public states: any;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private _toastr: Toastr,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private helper: Helper
  ) {
    this.customerId = this.route.snapshot.params.id;
    this.editPatient = new FormGroup({
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'gender': new FormControl(null, [Validators.required]),
      'date_of_birth': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'cell_phone_number': new FormControl(null, [Validators.required]),
      'email_phone_consent': new FormControl(null),
    });
  }

  ngOnInit(){
    this._getStates();
    this.getCustomerDetails();
  }

  get first_name() { return this.editPatient.get('first_name'); }
  get last_name() { return this.editPatient.get('last_name'); }
  get gender() { return this.editPatient.get('gender'); }
  get date_of_birth() { return this.editPatient.get('date_of_birth'); }
  get email() { return this.editPatient.get('email'); }
  get cell_phone_number() { return this.editPatient.get('cell_phone_number'); }
  get email_phone_consent() { return this.editPatient.get('email_phone_consent'); }

  getCustomerDetails(){
    const url = 'api/customers/view/' + this.customerId;
    this.http.get(url).subscribe((customer: any) => {

      this.editPatient.patchValue({
        id: customer.id,
        first_name:customer.first_name,
        last_name: customer.last_name,
        gender: customer.gender,
        date_of_birth: this.setBirthDate(customer.date_of_birth),
        email:customer.email,
        cell_phone_number: customer.cell_phone_number,
        email_phone_consent: customer.email_phone_consent
      });
        this.customerLoaded = true;
      }, err =>{
        this.customerLoaded = false;
      });
  }

  setBirthDate(date: any) {
    return moment(date).toISOString();
  }

  savePatient() {
    if (this.editPatient.invalid) {
      this.helper.markFormGroupTouched(this.editPatient);
      return;
    }

    const url = 'api/customers/update/' + this.customerId;
    this.http.post(url,this.editPatient.value).subscribe((res: any) => {
        if (res != null) {

            this._router.navigate(['admin', 'patients', 'view', this.customerId, 'orders']);
            this._toastr.showSuccess('Save Successfully');

        }
        this._changeDetectorRef.detectChanges();
      },
      err => {
        this._toastr.showError('Unable to save patient details.');
      }
    );
  }

  dateChange(event:any){
    this.editPatient.patchValue({
      date_of_birth:this.setBirthDate(event.value)
    });
  }

  private async _getStates() {
    const url = 'api/system_states/all';
    this.http.get(url).subscribe((data: any) => {
        this.states = data;
      },
      (err) => {

      });
  }

}
