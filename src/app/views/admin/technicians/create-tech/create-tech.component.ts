import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';
import { Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
@Component({
  selector: 'app-create-tech',
  templateUrl: './create-tech.component.html',
  styleUrls: ['./create-tech.component.scss']
})
export class CreateTechComponent implements OnInit {
  addTechnician: FormGroup
  constructor(
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private http: HttpClient,
    private _helper: Helper){

    this.addTechnician = new FormGroup({
      'first_name': new FormControl(null,[Validators.required]),
      'last_name': new FormControl(null,[Validators.required]),
      'gender': new FormControl(null,[Validators.required]),
      'email': new FormControl(null,[Validators.required, Validators.email]),
      'password': new FormControl(null,
        [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,15}')
        ]),
      'confirm_password': new FormControl(null, [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,15}')
      ]),
      'cell_phone_number': new FormControl(null, [Validators.required]),
      'email_phone_consent': new FormControl(true),
      'is_active': new FormControl(true),
      'add_memo_tab': new FormControl(true),
    }, {validators: this.MatchPassword});
  }

  MatchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let passwordControl:any = control.get('password')
    let confirmPasswordControl:any = control.get('confirm_password');
    let password = passwordControl.value;
    let confirmPassword = confirmPasswordControl.value;
    if (password !== confirmPassword) {
      confirmPasswordControl.setErrors({ ConfirmPassword: true });
      return null;
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }

  ngOnInit(){

  }

  get first_name() { return this.addTechnician.get('first_name'); }
  get last_name() { return this.addTechnician.get('last_name'); }
  get gender() { return this.addTechnician.get('gender'); }
  get email() { return this.addTechnician.get('email'); }
  get password() { return this.addTechnician.get('password'); }
  get confirm_password() { return this.addTechnician.get('confirm_password'); }
  get cell_phone_number() { return this.addTechnician.get('cell_phone_number'); }
  get email_phone_consent() { return this.addTechnician.get('email_phone_consent'); }
  get is_active() { return this.addTechnician.get('is_active'); }
  get add_memo_tab() { return this.addTechnician.get('add_memo_tab'); }


  saveTechnician() {
    if (this.addTechnician.invalid) {
      this._helper.markFormGroupTouched(this.addTechnician);
      return;
    }
    const url = 'api/technicians/create';
    this.http.post(url, this.addTechnician.value).subscribe((data: any) => {
        if (data != null) {
          if (data.errno != null) {
            this._toastr.showError(data.sqlMessage);
          } else {
            this._router.navigate(['/admin/technicians/list']);
            this._toastr.showSuccess('Save Successfully');
          }
        } else {
          this._toastr.showError('Unable to save technician.');
        }
        this._changeDetectorRef.detectChanges();
      },
      (err:any) => {
        this._toastr.showError('Unable to save technician.');
        this._changeDetectorRef.detectChanges();
      });
  }
}
