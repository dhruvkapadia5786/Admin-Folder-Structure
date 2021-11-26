import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { Toastr } from 'src/app/services/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pharmacy-user-create',
  templateUrl: './pharmacy-user-create.component.html',
  styleUrls: ['./pharmacy-user-create.component.scss']
})
export class PharmacyUserCreateComponent implements OnInit, OnDestroy {

  pharmacyId: any;
  pharmacyUserId: any;
  userForm: FormGroup;
  public states: any[] = [];
  // 2 mode : CREATE , EDIT
  formMode: string = 'CREATE'


  userRoles: any[] = [
    {
      key: 'PHARMACY_MANAGER',
      value: 'pharmacy_manager'
    },
    {
      key: 'PHARMACIST',
      value: 'pharmacist'
    },
    {
      key: 'PHARMACY_TECHNICIAN',
      value: 'pharmacy_technician'
    },
    {
      key: 'PHARMACY_CASHIER',
      value: 'pharmacy_cashier'
    }
  ];

  // validation patterns
  NUMBER_PATTERN = /^(0|[1-9][0-9]*)$/;
  RegExpValidator = {
    'lowerCase': RegExp(/^(?=.*?[a-z])/),
    'upperCase': RegExp(/^(?=.*?[A-Z])/),
    'digit': RegExp(/^(?=.*?[0-9])/),
    'specialChar': RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/),
  }
  validatorsArray: any[] = [];
  // validation flags
  showLicenseBlock = false;
  licenseLengthError = false;

  sub1: any;
  sub2: any;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public toastr: Toastr,
    private helper: Helper,
    public router: Router){

    let activatedRoute:any = this.route;
    if(activatedRoute){
      this.sub1 = activatedRoute.parent.parent.paramMap.subscribe((params: any) => {
        this.pharmacyId = params.get('id');
      });

      this.sub2 = activatedRoute.parent.paramMap.subscribe((params: any) => {
        this.pharmacyUserId = params.get('userid');
      });
    }

    this.userForm = new FormGroup({
      pharmacy_id: new FormControl(this.pharmacyId),
      role: new FormControl(null, [Validators.required]),
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      cell_phone_number: new FormControl(null, [Validators.required, Validators.pattern(this.NUMBER_PATTERN)]),
      email_phone_consent: new FormControl(true, []),
      add_memo_tab: new FormControl(true, []),
      gender: new FormControl(null, [Validators.required]),
      is_active: new FormControl(true, []),
      licenses: new FormArray([])
    });

    if (router.url.includes('create-user')){
      this.formMode = 'CREATE';
      this.userForm.addControl('password', new FormControl(null, []))
    } else {
      this.formMode = 'EDIT';
    }
  }

  getLicensesControls() {
    return (this.userForm.get('licenses') as FormArray)['controls'];
  }

  get role() { return this.userForm.get('role'); }
  get first_name() { return this.userForm.get('first_name'); }
  get last_name() { return this.userForm.get('last_name'); }
  get email() { return this.userForm.get('email'); }
  get cell_phone_number() { return this.userForm.get('cell_phone_number'); }
  get password() { return this.userForm.get('password'); }
  get email_phone_consent() { return this.userForm.get('email_phone_consent'); }
  get add_memo_tab() { return this.userForm.get('add_memo_tab'); }
  get gender() { return this.userForm.get('gender'); }
  get is_active() { return this.userForm.get('is_active'); }

  get licenses(): FormGroup {
    return new FormGroup({
      'license_number': new FormControl('', [Validators.required]),
      'expiry_date': new FormControl('', [Validators.required]),
      'state_id': new FormControl('', [Validators.required]),
      'is_active': new FormControl(true, [])
    });
  }

  ngOnInit() {
    this.getStates();
    if (this.formMode == 'EDIT') {
      this.patchFormValue()
    } else {
      this.setRulesAndValidators()
    }
  }

  ngOnDestroy() {
    if(this.sub1) {
      this.sub1.unsubscribe();
    }
    if(this.sub2) {
      this.sub2.unsubscribe();
    }
  }

  setRulesAndValidators(): void {
    this.validatorsArray = []
    this.validatorsArray.push(Validators.required);
    this.validatorsArray.push(Validators.minLength(8));
    this.validatorsArray.push(Validators.maxLength(30));
    this.validatorsArray.push(Validators.pattern(this.RegExpValidator.lowerCase))
    this.validatorsArray.push(Validators.pattern(this.RegExpValidator.upperCase))
    this.validatorsArray.push(Validators.pattern(this.RegExpValidator.digit))
    this.validatorsArray.push(Validators.pattern(this.RegExpValidator.specialChar))

    let passControl = this.userForm.get('password');
    if(passControl){
      passControl.setValidators(Validators.compose([...this.validatorsArray]));
    }
  }

  userFormSubmit() {
    if (this.userForm.invalid) {
      this.helper.markFormGroupTouched(this.userForm);
      return;
    }
    let url, operation = ''
    if (this.formMode == 'EDIT') {
      url = `api/pharmacies/update_user/${this.pharmacyUserId}`
      operation = 'updated'
    } else {
      url = 'api/pharmacies/create_user'
      operation = 'created'
    }
    this.http.post(url, this.userForm.value).subscribe((data: any) => {
      if (data != null) {
        if (data.errno != null) {
          this.toastr.showError(data.sqlMessage);
        } else {
          this.toastr.showSuccess(`Pharmacy User ${operation} successfully`);
          this.router.navigate(['admin', 'pharmacies', 'view', this.pharmacyId, 'user-management']);
        }
      }
    }, (err: any) => {
      this.toastr.showError('Unable to create user in pharmacy. Please try again!');
    });
  }

  handleChangeRole(value: any) {
    let roleFound = this.userRoles.find((item: any) => item.value == value);
    
    let licenseFormArray = this.userForm.get('licenses') as FormArray;
    this.clearFormArray(licenseFormArray);
    if (roleFound.key == 'PHARMACY_CASHIER') {
      this.showLicenseBlock = false;
    } else {
      this.addNewLicense();
      this.showLicenseBlock = true;
    }
  }


  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  public getStates() {
    this.http.get('api/system_states/all').subscribe((data: any) => {
      this.states = data;
    }, (err: any) => {

    });
  }

  public getStateList(currentStateId: number) {
    let selectedStateIds = (this.userForm.get('licenses') as FormArray)['value'].map((e: any) => e.state_id)
    selectedStateIds.splice(selectedStateIds.indexOf(currentStateId), 1)
    var filtered = this.states.filter(({ _id }) => !selectedStateIds.includes(_id));
    return filtered;
  }

  public patchFormValue() {
    let url = `api/pharmacies/view_user/${this.pharmacyUserId}`
    this.http.get(url).subscribe((data: any) => {
      this.userForm.patchValue({
        role: data.role,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        cell_phone_number: data.cell_phone_number,
        email_phone_consent: true,
        add_memo_tab: data.add_memo_tab,
        gender: data.gender,
        is_active: data.is_active
      });
      if (data.licenses && data.licenses.length > 0) {
        data.licenses.forEach((licanse: any) => {
          const licenseControl = this.userForm.get('licenses') as FormArray;
          const liceControl = new FormGroup({
            'license_number': new FormControl(licanse.license_number, [Validators.required]),
            'expiry_date': new FormControl(licanse.expiry_date, [Validators.required]),
            'state_id': new FormControl(licanse.state_id, [Validators.required]),
            'is_active': new FormControl(licanse.is_active),
          });
          licenseControl.push(liceControl);
        });
        this.showLicenseBlock = true;
      }
    }, (err: any) => { })
  }
  /**
   * Adds new empty pharmacy license form control to Pharmacy Licenses Array
   */
  public addNewLicense() {
    const licenseControl = this.userForm.get('licenses') as FormArray;
    licenseControl.push(this.licenses);
    this.hasLicenseLengthError();
  }

  /**
   * Removes Pharmacy License at given index from Pharmacy Licenses Array
   * @param index index of Pharmacy License to be removed
   */
  public removeLicense(index: number) {
    const licenseControl = this.userForm.get('licenses') as FormArray;
    licenseControl.removeAt(index);
    this.hasLicenseLengthError();
  }

  public hasLicenseLengthError() {
    const licenses = this.userForm.get('licenses') as FormArray;
    if (licenses.length < 1) {
      this.licenseLengthError = true;
    } else {
      this.licenseLengthError = false;
    }
    return this.licenseLengthError;
  }
}
