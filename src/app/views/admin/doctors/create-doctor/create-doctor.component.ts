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

  addDoctor: FormGroup;

  public addressError: boolean = false;
  public licenseError: boolean = false;
  public states: any[] = [];
  profilePhotoFile!:File;
  registrationCopyFile?:File;

  public clinics: any;
  public selectedClinic: any;
  public treatmentConditionsList: any=[];
  public consultationHealthConditionsList: any=[];

  designationArray=['Medical Superintendent', 'Deputy Medical superintendent', 'Chief Medical Officer', 'Senior Medical Officer', 'Medical Officer', 'Director', 'Principal', 'General Physician', 'Surgeon', 'Others'];
  disciplineArray=['Allopathy', 'Dental', 'Ayurveda', 'Yoga', 'Naturopathy', 'Unani', 'Siddha', 'Homeopathy', 'Sowa- Rigpa', 'Others'];
  registrationWithArray=['Medical Council of India (MCI)', 'Dental Council of India (DCI)', 'Central Council of Indian Medicine', 'Central Council of Homeopathy (CCH)', 'State Medical Councils/Boards', 'Other'];

  maxDate: Date = new Date();
  bsConfig={
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
 }

  constructor(
    private _toastr: Toastr,
    public cdr: ChangeDetectorRef,
    private _router: Router,
    private http: HttpClient
  ) {
    this._getStates();
    this.addDoctor = new FormGroup({
      'treatment_conditions': new FormControl(null, []),
      'consultation_health_conditions': new FormControl(null,[]),
      'first_name': new FormControl(null, [Validators.required]),
      'middle_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'prefix': new FormControl(null, [Validators.required]),
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
      'email_phone_consent': new FormControl(null),
      'is_active': new FormControl(null),
      'category': new FormControl(null, [Validators.required]),
      'designation': new FormControl(null,[Validators.required]),
      'discipline': new FormControl(null,[Validators.required]),
      'registration_with': new FormControl(null,[]),
      'registration_date': new FormControl(null, []),
      'registration_number': new FormControl(null, []),
      'registration_copy': new FormControl(null, []),
      'order_batch_size': new FormControl(null, [Validators.required]),
      'consultation_batch_size': new FormControl(null, [Validators.required]),
      'check_payable_to_name': new FormControl(null,[Validators.required]),
      'rate_per_prescription': new FormControl(null, [Validators.required]),
      'practice_addresses': new FormArray([]),
      'add_memo_tab': new FormControl(null, []),
      'licenses': new FormArray([]),
      'select_from_option': new FormControl('from_list', [Validators.required]),
      'selected_clinic_id': new FormControl(null,[]),
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
    this.getActiveTreatmentConditionList();
    this.getActiveConsultationHealthConditionList();
    this.addNewPracticeAddress()
  }

  private async _getClinics() {
    const url = 'api/clinics/active';
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
            selected_clinic_idControl.setValidators(null);
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
    this.selectedClinic = this.clinics.find((clinic: any) => clinic._id = value);
  }

  get treatment_conditions() { return this.addDoctor.get('treatment_conditions'); }
  get consultation_health_conditions() { return this.addDoctor.get('consultation_health_conditions'); }
  get check_payable_to_name() { return this.addDoctor.get('check_payable_to_name'); }
  get profile_photo(){ return this.addDoctor.get('profile_photo'); }
  get first_name() { return this.addDoctor.get('first_name'); }
  get middle_name() { return this.addDoctor.get('middle_name'); }
  get last_name() { return this.addDoctor.get('last_name'); }
  get suffix() { return this.addDoctor.get('suffix'); }
  get prefix() { return this.addDoctor.get('prefix'); }
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
  get email_phone_consent() { return this.addDoctor.get('email_phone_consent'); }

  get category() { return this.addDoctor.get('category');}
  get designation(){ return this.addDoctor.get('designation');}
  get discipline()  { return this.addDoctor.get('discipline');}
  get registration_with() { return this.addDoctor.get('registration_with');}
  get registration_date() { return this.addDoctor.get('registration_date'); }
  get registration_number() { return this.addDoctor.get('registration_number'); }
  get registration_copy() { return this.addDoctor.get('registration_copy'); }

  get is_active() { return this.addDoctor.get('is_active'); }
  get order_batch_size() { return this.addDoctor.get('order_batch_size'); }
  get consultation_batch_size() { return this.addDoctor.get('consultation_batch_size'); }
  get rate_per_prescription() { return this.addDoctor.get('rate_per_prescription'); }
  get portal_usage() { return this.addDoctor.get('portal_usage'); }
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
      'address_line_1': new FormControl('', [Validators.required]),
      'address_line_2': new FormControl(''),
      'city': new FormControl('', [Validators.required]),
      'state_id': new FormControl('', [Validators.required]),
      'zip_code': new FormControl('', [Validators.required]),
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
    this.http.get(url).subscribe((data: any) => {
        this.states = data;
      },
      (err) => {
      });
  }

  public getStateList(currentStateId: number){
    let licensesControl = this.addDoctor.get('licenses');
    let selectedStateIds: any = licensesControl ? licensesControl.value.map((e: any) => e.state_id):[];
    selectedStateIds.splice(selectedStateIds.indexOf(currentStateId), 1)

    var filtered = this.states.filter(({ id }) => !selectedStateIds.includes(id));
    return filtered;
  }

  getStateChange(stateValue: number) {
  }


  onFileSelect(event: any,type:string){
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      if(type=='profile_photo'){
        this.profilePhotoFile=file;
      }
      else if(type=='registration_copy'){
        this.registrationCopyFile=file;
      }
    }
  }

  public getActiveTreatmentConditionList(){
    const url = 'api/treatment_conditions/all';
    this.http.get(url).subscribe((conditionsList: any) => {
        this.treatmentConditionsList = conditionsList;
    }, err => {

    });
  }

  public getActiveConsultationHealthConditionList(){
    const url = 'api/consultation_health_conditions/all';
    this.http.get(url).subscribe((data: any) => {
        this.consultationHealthConditionsList = data;
    }, err => {

    });
  }


  public findInvalidControls(){
    const invalid = [];
    const controls = this.addDoctor.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  saveDoctor(): boolean | void {
    //let demo = this.findInvalidControls();

    if (this.hasPracticeAddressLengthError() || this.addDoctor.invalid) {
      this.markFormGroupTouched(this.addDoctor);
      return false;
    }
    const fd: FormData = new FormData();
    let formVal= this.addDoctor.value;
    let residentialState = this.states.find((item: any)=> item._id == formVal.residential_state_id)
    if (residentialState){
      formVal.residential_state = residentialState.name
    }
    formVal.licenses = formVal.licenses.map((item:any)=>{
      let stFound = this.states.find((st:any)=>st._id == item.state_id);
      item.state_name  = stFound.name;
      return item;
    });
    formVal.practice_addresses = formVal.practice_addresses.map((item:any)=>{
      let stFound:any = this.states.find((st:any)=>st._id == item.state_id);
      item.state  =stFound.name;
      return item;
    });
    fd.append('doctor', JSON.stringify(formVal));
    if(this.profilePhotoFile){
      fd.append('profile_photo',this.profilePhotoFile);
    }
    if(this.registrationCopyFile){
     fd.append('registration_copy',this.registrationCopyFile);
    }
    const url = 'api/doctors/create';
    const data = fd;
    this.http.post(url, data).subscribe((res: any) => {
        this._router.navigate(['/admin/doctors/list']);
        this._toastr.showSuccess('Save Successfully');
      },
      err => {
        this._toastr.showError('Unable to save doctor.');
        this.cdr.detectChanges();
      });
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
