import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Toastr } from '../../../../services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminPharmacyDetails } from '../../../../models/admin/AdminPharmacy';

@Component({
  selector: 'app-pharmacy-edit',
  templateUrl: './pharmacy-edit.component.html',
  styleUrls: ['./pharmacy-edit.component.scss']
})
export class PharmacyEditComponent implements OnInit {
  public addPharmacyForm!: FormGroup;
  public practiceAddressFormGroup!: FormGroup;
  // public licenseFormGroup: FormGroup;
  public pharmacyObj!: AdminPharmacyDetails;
  public pharmacyObjClone!: AdminPharmacyDetails;
  public states!: any[];
  public pharmacyId: any;
  selectedFile!:File;
  public professionalLiabilityDocumentImg: any;
  public pharmacyTypes = [
    {
      key:"Retail",
      value:"Retail"
    },
    {
      key:"Long Term Care",
      value:"LongTermCare"
    },
    {
      key:"Specialty",
      value:"Specialty"
    },
    {
      key:"Mail Order",
      value:"MailOrder"
    },
    {
      key:"Central Filled",
      value:"CentralFilled"
    },
    {
      key:"TSO",
      value:"TSO"
    },
    {
      key:"International",
      value:"International"
    }
  ];

  // validation patterns
  NUMBER_PATTERN = /^(0|[1-9][0-9]*)$/;
  PASSWORD_PATTERN = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,15}/;

  // validation flags
  addressLengthError = false;
  licenseLengthError = false;

  constructor(
    private http: HttpClient,
    public cdr: ChangeDetectorRef,
    public toastr: Toastr,
    public router: Router,
    public activeRoute: ActivatedRoute
  ) {
    this.pharmacyId = this.activeRoute.snapshot.paramMap.get('id');
    // initialize form
    this.initializeForm();
    this.getStates();
    this.getPharmacy();
  }

  ngOnInit() {
  }

  initializeForm() {
    this.addPharmacyForm = new FormGroup({
      'pharmacy_name': new FormControl(null, [Validators.required]),
      'pharmacy_type': new FormControl(null, [Validators.required]),
      'llc_name': new FormControl(null, [Validators.required]),
      'check_payable_to_name': new FormControl(null, [Validators.required]),
      'phone_number': new FormControl(null, [Validators.required, Validators.pattern(this.NUMBER_PATTERN)]),
      'fax_number': new FormControl(null, [Validators.required]),
      'npi_number': new FormControl(null, [Validators.required]),
      'dea_number': new FormControl(null, [Validators.required]),
      'ncpdp':new FormControl(null, [Validators.required]),
      'professional_liability_policy_number': new FormControl(null, [Validators.required]),
      'professional_liability_document': new FormControl(null),
      'professional_liability_policy_expiry': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(true, []),
      'practice_addresses': new FormArray([]),
      'licenses': new FormArray([])
    });

    this.practiceAddressFormGroup = new FormGroup({
      'address_line_1': new FormControl(null, [Validators.required]),
      'address_line_2': new FormControl(null, []),
      'city': new FormControl(null, [Validators.required]),
      'state_id': new FormControl(null, [Validators.required]),
      'zip_code': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
    });

  }

  public getPharmacy() {
    this.http.get('api/pharmacies/view/' + this.pharmacyId).subscribe((data: any) => {
        this.pharmacyObj = data;
        this.professionalLiabilityDocumentImg = this.pharmacyObj.professional_liability_document;
        this.pharmacyObjClone = JSON.parse(JSON.stringify(this.pharmacyObj));

        this.pharmacyObjClone.professional_liability_document = '';
        this.pharmacyObjClone.practice_addresses = [];
        this.pharmacyObjClone.licenses = [];

        this.addPharmacyForm.patchValue({
          pharmacy_name: this.pharmacyObjClone.pharmacy_name,
          pharmacy_type: this.pharmacyObjClone.pharmacy_type,
          llc_name:  this.pharmacyObjClone.llc_name,
          check_payable_to_name:this.pharmacyObjClone.check_payable_to_name,
          phone_number: this.pharmacyObjClone.phone_number,
          fax_number: this.pharmacyObjClone.fax_number,
          npi_number: this.pharmacyObjClone.npi_number,
          dea_number: this.pharmacyObjClone.dea_number,
          ncpdp:this.pharmacyObjClone.ncpdp,
          professional_liability_policy_number: this.pharmacyObjClone.professional_liability_policy_number,
          professional_liability_policy_expiry: this.pharmacyObjClone.professional_liability_policy_expiry,
          is_active: this.pharmacyObjClone.is_active,
        });
        const addressControl = this.addPharmacyForm.get('practice_addresses') as FormArray;
        const licenseControl = this.addPharmacyForm.get('licenses') as FormArray;

        this.pharmacyObj.practice_addresses.forEach((address:any) => {
          const aControl = new FormGroup({
            'address_line_1': new FormControl(address.address_line_1, [Validators.required]),
            'address_line_2': new FormControl(address.address_line_2, []),
            'city': new FormControl(address.city, [Validators.required]),
            'state_id': new FormControl(address.state_id, [Validators.required]),
            'zip_code': new FormControl(address.zip_code, [Validators.required]),
            'is_active': new FormControl(address.is_active, [])
          });
          addressControl.push(aControl);
        });
        this.pharmacyObj.licenses.forEach((license:any) => {
          const lControl = new FormGroup({
            'license_number': new FormControl(license.license_number, [Validators.required]),
            'expiry_date': new FormControl(license.expiry_date, [Validators.required]),
            'state_id': new FormControl(license.state_id, [Validators.required]),
            'is_active': new FormControl(license.is_active, [])
          });
          licenseControl.push(lControl);
        });
      }, err => {

      });
    // this.cdr.detectChanges();
  }
  public getStates() {
    this.http.get('api/system_states/all')
      .subscribe((data: any) => {
        this.states = data;
      }, err => {

      });
    }

  public getStateList(currentStateId: number) {
    let selectedStateIds = (this.addPharmacyForm.get('licenses') as FormArray)['value'].map((e: any) => isNaN(parseInt(e.state_id)) ? '' : parseInt(e.state_id))
    selectedStateIds.splice(selectedStateIds.indexOf(currentStateId), 1)
    var filtered = this.states.filter(({ id }) => !selectedStateIds.includes(id));
    return filtered;
  }

  // form control getters
  get pharmacy_name() { return this.addPharmacyForm.get('pharmacy_name'); }
  get pharmacy_type(){ return this.addPharmacyForm.get('pharmacy_type'); }
  get llc_name() { return this.addPharmacyForm.get('llc_name'); }
  get check_payable_to_name() { return this.addPharmacyForm.get('check_payable_to_name'); }
  get phone_number() { return this.addPharmacyForm.get('phone_number'); }
  get fax_number() { return this.addPharmacyForm.get('fax_number'); }
  get npi_number() { return this.addPharmacyForm.get('npi_number'); }
  get ncpdp() { return this.addPharmacyForm.get('ncpdp'); }
  get dea_number() { return this.addPharmacyForm.get('dea_number'); }
  get professional_liability_policy_number() { return this.addPharmacyForm.get('professional_liability_policy_number'); }
  get professional_liability_document() { return this.addPharmacyForm.get('professional_liability_document'); }
  get professional_liability_policy_expiry() { return this.addPharmacyForm.get('professional_liability_policy_expiry'); }
  get is_active() { return this.addPharmacyForm.get('is_active'); }

  get practice_addresses() {
    return new FormGroup({
      'address_line_1': new FormControl(null, [Validators.required]),
      'address_line_2': new FormControl(null, []),
      'city': new FormControl(null, [Validators.required]),
      'state_id': new FormControl(null, [Validators.required]),
      'zip_code': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, [])
    });
  }

  get licenses(): FormGroup {
    return new FormGroup({
      'license_number': new FormControl('', [Validators.required]),
      'expiry_date': new FormControl('', [Validators.required]),
      'state_id': new FormControl('', [Validators.required]),
      'is_active': new FormControl(true, [])
    });
  }

  getPracticeAddressesControls() {
    return (this.addPharmacyForm.get('practice_addresses') as FormArray)['controls'];
  }

  getLicensesControls() {
    return (this.addPharmacyForm.get('licenses') as FormArray)['controls'];
  }

  /**
   * Adds new empty practice address form control to Practice Addresses Array
   */
  public addNewPracticeAddress() {
    const addressControl = this.addPharmacyForm.get('practice_addresses') as FormArray;
    addressControl.push(this.practice_addresses);
    this.hasAddressLengthError();
  }

  /**
   * Removes Practice Address at given index from Practice Addresses Array
   * @param index index of Practice Address to be removed
   */
  public removePracticeAddress(index:number) {
    const addressControl = this.addPharmacyForm.get('practice_addresses')  as FormArray;
    addressControl.removeAt(index);
    this.hasAddressLengthError();
  }

  /**
   * Adds new empty pharmacy address form control to Pharmacy Addresses Array
   */
  public addNewLicense() {
    const licenseControl = this.addPharmacyForm.get('licenses') as FormArray;
    licenseControl.push(this.licenses);
    this.hasLicenseLengthError();
  }

  /**
   * Removes Pharmacy Address at given index from Pharmacy Addresses Array
   * @param index index of Pharmacy Address to be removed
   */
  public removeLicense(index:number) {
    const licenseControl = this.addPharmacyForm.get('licenses') as FormArray;
    licenseControl.removeAt(index);
    this.hasLicenseLengthError();
  }

  public hasAddressLengthError() {
    const addresses = this.addPharmacyForm.get('practice_addresses')  as FormArray;
    if (addresses.length < 1) {
      this.addressLengthError = true;
    } else {
      this.addressLengthError = false;
    }
    return this.addressLengthError;
  }

  public hasLicenseLengthError() {
    const licenses = this.addPharmacyForm.get('licenses') as FormArray;
    if (licenses.length < 1){
      this.licenseLengthError = true;
    } else {
      this.licenseLengthError = false;
    }
    return this.licenseLengthError;
  }

  onFileSelect(event:any){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
    }
  }

  addPharmacySubmit(){
    if (this.addPharmacyForm.invalid) {
      this.markFormGroupTouched(this.addPharmacyForm);
      window.scrollTo(0, 0);
      return;
    }
    const fd: FormData = new FormData();
    let formVal= this.addPharmacyForm.value;
    formVal.licenses = formVal.licenses.map((item:any)=>{
       let stFound:any = this.states.find((st:any)=>st._id == item.state_id);
       item.state_name  =stFound.name;
       return item;
    });
    formVal.practice_addresses = formVal.practice_addresses.map((item:any)=>{
      let stFound:any = this.states.find((st:any)=>st._id == item.state_id);
      item.state  =stFound.name;
      return item;
   });

    fd.append('pharmacy', JSON.stringify(formVal));
    if (formVal.professional_liability_document == null){
      fd.append('lb_policy_document', this.professionalLiabilityDocumentImg);
    } else {
      fd.append('lb_policy_document',this.selectedFile);
    }
    this.http.post('api/pharmacies/update/' + this.pharmacyId, fd)
      .subscribe((data: any) => {
        if (data != null) {
          if (data.errno != null) {
            this.toastr.showError(data.sqlMessage);
          } else {
            this.toastr.showSuccess('Pharmacy details updated successfully');
            this.router.navigate(['admin', 'pharmacies']);
          }
        }
      }, err => {
        this.toastr.showError('Unable to save pharmacy details. Please try again!');
    });
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control:any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
