import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Toastr } from '../../../../services/toastr.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminPharmacyDetails } from '../../../../models/admin/AdminPharmacy';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pharmacy-edit',
  templateUrl: './pharmacy-edit.component.html',
  styleUrls: ['./pharmacy-edit.component.scss']
})
export class PharmacyEditComponent implements OnInit {
  public addPharmacyForm!: FormGroup;
  public pharmacyObj!: AdminPharmacyDetails;
  public pharmacyObjClone!: AdminPharmacyDetails;
  public states!: any[];
  public pharmacyId: any;
  selectedFile!:File;
  lbDocImageUrl!: any;
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
    public activeRoute: ActivatedRoute){
    this.pharmacyId = this.activeRoute.snapshot.paramMap.get('id');
    // initialize form
    this.initializeForm();
    this.getStates();
    this.getPharmacy();
  }

  ngOnInit(){

  }

  initializeForm(){
    this.addPharmacyForm = new FormGroup({
      'pharmacy_name': new FormControl(null, [Validators.required]),
      'pharmacy_type': new FormControl(null, [Validators.required]),
      'llc_name': new FormControl(null, [Validators.required]),
      'check_payable_to_name': new FormControl(null, [Validators.required]),
      'phone_number': new FormControl(null, [Validators.required, Validators.pattern(this.NUMBER_PATTERN)]),
      'fax_number': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(true, []),
      'practice_addresses': new FormArray([]),
      'licenses': new FormArray([]),
      'other_details': new FormArray([])
    });
  }

  getLocalImage(path:any){
    if(path!=null){
      return environment.api_url+path;
    }else{
      return '/src/assets/img/no_preview.png';
    }
  }

  public getPharmacy() {
    this.http.get('api/pharmacies/view/' + this.pharmacyId).subscribe((data: any) => {
        this.pharmacyObj = data;
        /*
        this.professionalLiabilityDocumentImg = this.pharmacyObj.professional_liability_document;
        this.lbDocImageUrl = this.getLocalImage(this.pharmacyObj.professional_liability_document);
         */
        this.pharmacyObjClone = JSON.parse(JSON.stringify(this.pharmacyObj));
        this.pharmacyObjClone.practice_addresses = [];
        this.pharmacyObjClone.licenses = [];
        this.pharmacyObjClone.other_details = [];

        this.addPharmacyForm.patchValue({
          pharmacy_name: this.pharmacyObjClone.pharmacy_name,
          pharmacy_type: this.pharmacyObjClone.pharmacy_type,
          llc_name:  this.pharmacyObjClone.llc_name,
          check_payable_to_name:this.pharmacyObjClone.check_payable_to_name,
          phone_number: this.pharmacyObjClone.phone_number,
          fax_number: this.pharmacyObjClone.fax_number,
          is_active: this.pharmacyObjClone.is_active,
        });
        const addressControl = this.addPharmacyForm.get('practice_addresses') as FormArray;
        const licenseControl = this.addPharmacyForm.get('licenses') as FormArray;
        const otherDetailsControl = this.addPharmacyForm.get('other_details') as FormArray;

        this.pharmacyObj.practice_addresses.forEach((address:any) => {
          const aControl = new FormGroup({
            'address_line_1': new FormControl(address.address_line_1, [Validators.required]),
            'address_line_2': new FormControl(address.address_line_2, []),
            'city': new FormControl(address.city, [Validators.required]),
            'state_id': new FormControl(address.state_id, [Validators.required]),
            'zip_code': new FormControl(address.zip_code, [Validators.required]),
            'is_active': new FormControl(address.is_active, []),
            'is_default': new FormControl(true, [])
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
        if(this.pharmacyObj.other_details){
          this.pharmacyObj.other_details.forEach((details:any) => {
            const lControl = new FormGroup({
              'key': new FormControl(details.key, [Validators.required]),
              'value': new FormControl(details.value, [Validators.required]),
            });
            otherDetailsControl.push(lControl);
          });
        }
      }, err => {

      });
    // this.cdr.detectChanges();
  }
  public getStates() {
    this.http.get('api/system_states/all').subscribe((data: any) => {
        this.states = data;
      }, err => {

      });
    }

  public getStateList(currentStateId: any) {
    let selectedStateIds = (this.addPharmacyForm.get('licenses') as FormArray)['value'].map((e: any) =>e.state_id.toString())
    selectedStateIds.splice(selectedStateIds.indexOf(currentStateId), 1)
    var filtered = this.states.filter(({ _id }) => !selectedStateIds.includes(_id));
    return filtered;
  }

  // form control getters
  get pharmacy_name() { return this.addPharmacyForm.get('pharmacy_name'); }
  get pharmacy_type(){ return this.addPharmacyForm.get('pharmacy_type'); }
  get llc_name() { return this.addPharmacyForm.get('llc_name'); }
  get check_payable_to_name() { return this.addPharmacyForm.get('check_payable_to_name'); }
  get phone_number() { return this.addPharmacyForm.get('phone_number'); }
  get fax_number() { return this.addPharmacyForm.get('fax_number'); }
  get is_active() { return this.addPharmacyForm.get('is_active'); }


  get practice_addresses() {
    return new FormGroup({
      'address_line_1': new FormControl(null, [Validators.required]),
      'address_line_2': new FormControl(null, []),
      'city': new FormControl(null, [Validators.required]),
      'state_id': new FormControl(null, [Validators.required]),
      'zip_code': new FormControl(null, [Validators.required]),
      'is_active': new FormControl(null, []),
      'is_default': new FormControl(null, [])
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

  get keyvaluePair(): FormGroup {
    return new FormGroup({
      'key': new FormControl('', [Validators.required]),
      'value': new FormControl('', [Validators.required])
    });
  }

  getKeyValuePairsControls(){
    return (this.addPharmacyForm.get('other_details') as FormArray)['controls'];
  }

  public addNewKeyValuePair() {
    const addressControl: FormArray = this.addPharmacyForm.get('other_details') as FormArray;
    addressControl.push(this.keyvaluePair);
  }

  public removeKeyValuePair(index:number) {
    const addressControl = this.addPharmacyForm.get('other_details')as FormArray;
    addressControl.removeAt(index);
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
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;

      reader.readAsDataURL(file);
      reader.onload = () => {
          this.lbDocImageUrl = reader.result;
      }
    }
  }

  editPharmacySubmit(){
    if (this.addPharmacyForm.invalid) {
      this.markFormGroupTouched(this.addPharmacyForm);
      window.scrollTo(0, 0);
      return;
    }
    const fd: FormData = new FormData();
    let formVal= this.addPharmacyForm.value;
    console.log('formVal=',formVal);

    if(formVal.licenses){
      formVal.licenses = formVal.licenses.map((item:any)=>{
        let stFound:any = this.states.find((st:any)=>st._id.toString() == item.state_id.toString());
        item.state_name = stFound ? stFound.name:null;
        return item;
      });
      console.log('formVal licenses=',formVal.licenses);
    }

    if(formVal.practice_addresses){
      formVal.practice_addresses = formVal.practice_addresses.map((item:any)=>{
        let stFound:any = this.states.find((st:any)=>st._id.toString() == item.state_id.toString());
        item.state  =stFound ? stFound.name:null;
        return item;
      });
      console.log('formVal practice_addresses=',formVal.practice_addresses);
    }

    fd.append('pharmacy', JSON.stringify(formVal));
    /* if (formVal.professional_liability_document == null){
      fd.append('professional_liability_document', this.professionalLiabilityDocumentImg);
    } else {
      fd.append('professional_liability_document',this.selectedFile);
    } */
    this.http.post('api/pharmacies/update/' + this.pharmacyId, fd).subscribe((data: any) => {

            this.toastr.showSuccess('Pharmacy details updated successfully');
            this.router.navigate(['admin', 'pharmacies']);

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
