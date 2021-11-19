import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Toastr } from '../../../../services/toastr.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.component.html',
  styleUrls: ['./create-doctor.component.scss']
})
export class CreateDoctorComponent implements OnInit {
  professionalLiabilityDocument!: File;
  addDoctor: FormGroup;

  public addressError: boolean = false;
  public licenseError: boolean = false;
  public states: any[] = [];

  public clinics: any;
  public selectedClinic: any;

  constructor(
    private _toastr: Toastr,
    public cdr: ChangeDetectorRef,
    private _router: Router,
    private http: HttpClient
  ) {
    this._getStates();
    this.addDoctor = new FormGroup({
      'pet_types': new FormControl([], []),
      'company_name': new FormControl(null, [Validators.required]),
      'llc_name': new FormControl(null, [Validators.required]),
      'check_payable_to_name': new FormControl(null, [Validators.required]),
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'suffix': new FormControl(null, [Validators.required]),
      'display_name': new FormControl(null, [Validators.required]),
      'fax_number': new FormControl(null, [Validators.required]),
      'gender': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'date_of_birth': new FormControl(null, [Validators.required]),
      'residential_address_1': new FormControl(null, [Validators.required]),
      'residential_address_2': new FormControl(null),
      'residential_city': new FormControl(null, [Validators.required]),
      'residential_state_id': new FormControl(null, [Validators.required]),
      'residential_zipcode': new FormControl(null, [Validators.required]),
      'password': new FormControl(null,
        [
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,15}')
        ]),
      'confirm_password': new FormControl(null, [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,15}')
      ]),
      'cell_phone_number': new FormControl(null, [Validators.required]),
      'emailPhoneConsent': new FormControl(null),
      'is_active': new FormControl(null),
      'professional_liability_policy_number': new FormControl(null, [Validators.required]),
      'npi_number': new FormControl(null, [Validators.required]),
      'dea_number': new FormControl(null, [Validators.required]),
      'order_batch_size': new FormControl(null, [Validators.required]),
      'consultation_batch_size': new FormControl(null, [Validators.required]),
      'professional_liability_document': new FormControl(null, [Validators.required]),
      'professional_liability_document_expiry_date': new FormControl(null, [Validators.required]),
      'practice_addresses': new FormArray([]),
      'add_memo_tab': new FormControl(null, []),
      'licenses': new FormArray([]),
      'select_from_option': new FormControl('from_list', [Validators.required]),
      'selected_clinic_id': new FormControl(null, [Validators.required]),
      'clinic_name': new FormControl(null, []),
      'clinic_long_name': new FormControl(null, []),
      'clinic_address_line_1': new FormControl(null, []),
      'clinic_address_line_2': new FormControl(null),
      'clinic_city_name': new FormControl(null, []),
      'clinic_state_id': new FormControl(null, []),
      'clinic_state': new FormControl(null, []),
      'clinic_zip': new FormControl(null, []),
      'clinic_phone': new FormControl(null, [])
    }, { validators: this.MatchPassword });

    // this.setClinicValidators();
  }

  MatchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let passwordControl: any = control.get('password')
    let confirmPasswordControl: any = control.get('confirm_password');
    let password = passwordControl.value;
    let confirm_password = confirmPasswordControl.value;
    if (password !== confirm_password) {
      confirmPasswordControl.setErrors({ confirm_password: true });
      return null;
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }

  ngOnInit() {
    this._getClinics();
    this.addNewPracticeAddress()
  }

  private async _getClinics() {
    const url = 'api/v1/admin/clinics/available_clinics';
    this.http.get(url).subscribe(
      (data: any) => {
        this.clinics = data;
      },
      (err) => { }
    );
  }

  setClinicValidators() {
    const select_from_optionControl = this.addDoctor.get('select_from_option');
    const selected_clinic_idControl: any = this.addDoctor.get('selected_clinic_id');
    const clinic_nameControl: any = this.addDoctor.get('clinic_name');
    const clinic_long_nameControl: any = this.addDoctor.get('clinic_long_name');
    const clinic_address_line_1Control: any = this.addDoctor.get('clinic_address_line_1');
    const clinic_city_nameControl: any = this.addDoctor.get('clinic_city_name');
    const clinic_state_idControl: any = this.addDoctor.get('clinic_state_id');
    const clinic_stateControl: any = this.addDoctor.get('clinic_state');
    const clinic_zipControl: any = this.addDoctor.get('clinic_zip');
    const clinic_phoneControl: any = this.addDoctor.get('clinic_phone');

    if(select_from_optionControl) {
      select_from_optionControl.valueChanges
        .subscribe(selectedOption => {
          if (selectedOption === 'from_list') {
            selected_clinic_idControl.setValidators([Validators.required]);
            clinic_nameControl.clearValidators();
            clinic_long_nameControl.clearValidators();
            clinic_address_line_1Control.clearValidators();
            clinic_city_nameControl.clearValidators();
            clinic_state_idControl.clearValidators();
            clinic_stateControl.clearValidators();
            clinic_zipControl.clearValidators();
            clinic_phoneControl.clearValidators();

            this.addDoctor.patchValue({
              clinic_name: null,
              clinic_long_name: null,
              clinic_address_line_1: null,
              clinic_address_line_2: null,
              clinic_city_name: null,
              clinic_state_id: null,
              clinic_state: null,
              clinic_zip: null,
              clinic_phone: null
            });

          }

          if (selectedOption === 'add_new') {
            selected_clinic_idControl.clearValidators();
            clinic_nameControl.setValidators([Validators.required]);
            clinic_long_nameControl.setValidators([Validators.required]);
            clinic_address_line_1Control.setValidators([Validators.required]);
            clinic_city_nameControl.setValidators([Validators.required]);
            clinic_state_idControl.setValidators([Validators.required]);
            clinic_stateControl.setValidators([Validators.required]);
            clinic_zipControl.setValidators([Validators.required]);
            clinic_phoneControl.setValidators([Validators.required]);

            this.addDoctor.patchValue({
              selected_clinic_id: null
            });
          }

          selected_clinic_idControl.updateValueAndValidity();
          clinic_nameControl.updateValueAndValidity();
          clinic_long_nameControl.updateValueAndValidity();
          clinic_address_line_1Control.updateValueAndValidity();
          clinic_city_nameControl.updateValueAndValidity();
          clinic_state_idControl.updateValueAndValidity();
          clinic_stateControl.updateValueAndValidity();
          clinic_zipControl.updateValueAndValidity();
          clinic_phoneControl.updateValueAndValidity();
        });
    }

  }

  getClinicChange(value: number) {
    this.selectedClinic = this.clinics.find((clinic: any) => clinic.doesspot_clinic_id = value);
  }

  get pet_types() { return this.addDoctor.get('pet_types'); }
  get company_name() { return this.addDoctor.get('company_name'); }
  get llc_name() { return this.addDoctor.get('llc_name'); }
  get check_payable_to_name() { return this.addDoctor.get('check_payable_to_name'); }
  get first_name() { return this.addDoctor.get('first_name'); }
  get last_name() { return this.addDoctor.get('last_name'); }
  get suffix() { return this.addDoctor.get('suffix'); }
  get display_name() { return this.addDoctor.get('display_name'); }
  get fax_number() { return this.addDoctor.get('fax_number'); }
  get gender() { return this.addDoctor.get('gender'); }
  get email() { return this.addDoctor.get('email'); }
  get date_of_birth() { return this.addDoctor.get('date_of_birth'); }
  get residential_address_1() { return this.addDoctor.get('residential_address_1'); }
  get residential_address_2() { return this.addDoctor.get('residential_address_2'); }
  get residential_city() { return this.addDoctor.get('residential_city'); }
  get residential_state_id() { return this.addDoctor.get('residential_state_id'); }
  get password() { return this.addDoctor.get('password'); }
  get confirm_password() { return this.addDoctor.get('confirm_password'); }
  get cell_phone_number() { return this.addDoctor.get('cell_phone_number'); }
  get emailPhoneConsent() { return this.addDoctor.get('emailPhoneConsent'); }
  get is_active() { return this.addDoctor.get('is_active'); }
  get professional_liability_policy_number() { return this.addDoctor.get('professional_liability_policy_number'); }
  get npi_number() { return this.addDoctor.get('npi_number'); }
  get dea_number() { return this.addDoctor.get('dea_number'); }
  get order_batch_size() { return this.addDoctor.get('order_batch_size'); }
  get consultation_batch_size() { return this.addDoctor.get('consultation_batch_size'); }

  get professional_liability_document() { return this.addDoctor.get('professional_liability_document'); }
  get professional_liability_document_expiry_date() { return this.addDoctor.get('professional_liability_document_expiry_date'); }
  get residential_zipcode() { return this.addDoctor.get('residential_zipcode'); }
  get add_memo_tab() { return this.addDoctor.get('add_memo_tab'); }

  get select_from_option() { return this.addDoctor.get('select_from_option'); }
  get selected_clinic_id() { return this.addDoctor.get('selected_clinic_id'); }
  get clinic_name() { return this.addDoctor.get('clinic_name'); }
  get clinic_long_name() { return this.addDoctor.get('clinic_long_name'); }
  get clinic_address_line_1() { return this.addDoctor.get('clinic_address_line_1'); }
  get clinic_address_line_2() { return this.addDoctor.get('clinic_address_line_2'); }
  get clinic_city_name() { return this.addDoctor.get('clinic_city_name'); }
  get clinic_state_id() { return this.addDoctor.get('clinic_state_id'); }
  get clinic_state() { return this.addDoctor.get('clinic_state'); }
  get clinic_zip() { return this.addDoctor.get('clinic_zip'); }
  get clinic_phone() { return this.addDoctor.get('clinic_phone'); }

  getPracticeAddresses() {
    return (this.addDoctor.get('practice_addresses') as FormArray)['controls'];
  }

  getLicensesControls() {
    return (this.addDoctor.get('licenses') as FormArray)['controls'];
  }

  get practiceAddresses(): FormGroup {
    return new FormGroup({
      'address_line1': new FormControl('', [Validators.required]),
      'address_line2': new FormControl(''),
      'city_name': new FormControl('', [Validators.required]),
      'state_id': new FormControl('', [Validators.required]),
      'zipcode': new FormControl('', [Validators.required]),
      'is_active': new FormControl(true),
    });
  }

  get licensesGrup(): FormGroup {
    return new FormGroup({
      'license_number': new FormControl('', [Validators.required]),
      'expiry_date': new FormControl('', [Validators.required]),
      'state_id': new FormControl('', [Validators.required]),
      'is_active': new FormControl(true, []),
    });
  }

  public addNewPracticeAddress() {
    const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
    addressControl.push(this.practiceAddresses);
    this.hasPracticeAddressLengthError();
    this.cdr.detectChanges();
  }

  public removeAddress(index:number) {
    const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
    addressControl.removeAt(index);
    this.hasPracticeAddressLengthError();
  }

  public hasPracticeAddressLengthError() {
    const addressControl =this.addDoctor.get('practice_addresses') as FormArray;
    if (addressControl.length < 1) {
      this.addressError = true;
    } else {
      this.addressError = false;
    }
    return this.addressError;
  }

  public addNewLicense() {
    const licenseControl = this.addDoctor.get('licenses') as FormArray;
    licenseControl.push(this.licensesGrup);
    this.hasLicenseLengthError();
  }

  public removeLicense(index:number) {
    const licenseControl = this.addDoctor.get('licenses') as FormArray;
    licenseControl.removeAt(index);
    this.hasLicenseLengthError();
  }

  public hasLicenseLengthError() {
    const licenseControl = this.addDoctor.get('licenses') as FormArray;
    if (licenseControl.length < 1) {
      this.licenseError = true;
    } else {
      this.licenseError = false;
    }
    return this.licenseError;
  }

  private async _getStates() {
    const url = 'api/system_states/all';
    this.http.get(url).subscribe(
      (data: any) => {
        this.states = data;
      },
      (err) => {
      }
    );
  }

  public getStateList(currentStateId: number) {
    let licensesControl = this.addDoctor.get('licenses');
    let selectedStateIds: any = licensesControl ? licensesControl.value.map((e: any) => e.state_id):[];
    selectedStateIds.splice(selectedStateIds.indexOf(currentStateId), 1)

    var filtered = this.states.filter(({ id }) => !selectedStateIds.includes(id));
    return filtered;
  }

  getStateChange(stateValue: number) {
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.professionalLiabilityDocument = file;
    }
  }

  saveDoctor(): boolean | void {
    if (this.hasPracticeAddressLengthError() || this.addDoctor.invalid) {
      this.markFormGroupTouched(this.addDoctor);
      return false;
    }
    const fd: FormData = new FormData();
    fd.append('doctor', JSON.stringify(this.addDoctor.value));
    fd.append('professional_liability_document', this.professionalLiabilityDocument);
    const url = 'api/doctors/create';
    const data = fd;
    this.http.post(url, data).subscribe(
      (res: any) => {
        if (res != null) {
          if (res.errno != null) {
            this._toastr.showError(res.sqlMessage);
          } else {
            this._router.navigate(['/admin/doctors/list']);
            this._toastr.showSuccess('Save Successfully');
          }
        }
        this.cdr.detectChanges();
      },
      err => {
        this._toastr.showError('Unable to save doctor.');
        this.cdr.detectChanges();
      }
    );
    }


  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
