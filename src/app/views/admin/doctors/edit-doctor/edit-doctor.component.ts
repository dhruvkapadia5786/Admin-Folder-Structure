import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from '../../../../services/toastr.service';

@Component({
  selector: 'app-edit-doctor',
  templateUrl: './edit-doctor.component.html',
  styleUrls: ['./edit-doctor.component.scss']
})
export class EditDoctorComponent implements OnInit {
  doctorId: any;
  doctorObj:any;
  addDoctor: FormGroup
  licenses!: FormGroup;
  practice_addresses!: FormGroup;
  professionalLiabilityDocument!:File;

  public addressError: boolean = false;
  public licenseError: boolean = false;
  public states: any[]=[];

  constructor(
    public http: HttpClient,
    public cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private toastr: Toastr,
    public router: Router
  ) {
    this.doctorId = this.route.snapshot.paramMap.get('id');

    this.addDoctor = new FormGroup({
      'id': new FormControl(null,[Validators.required]),
      'company_name': new FormControl(null, [Validators.required]),
      'llc_name': new FormControl(null, [Validators.required]),
      'check_payable_to_name': new FormControl(null, [Validators.required]),
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'suffix': new FormControl(null, [Validators.required]),
      'display_name': new FormControl(null, [Validators.required]),
      'fax_number':new FormControl(null, [Validators.required]),
      'gender': new FormControl(null,[Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'date_of_birth': new FormControl(null,[Validators.required]),
      'residential_address_1': new FormControl(null,[Validators.required]),
      'residential_address_2': new FormControl(null),
      'residential_city': new FormControl(null,[Validators.required]),
      'residential_state_id': new FormControl(null,[Validators.required]),
      'residential_zipcode': new FormControl(null,[Validators.required]),
      'cell_phone_number': new FormControl(null,[Validators.required]),
      'emailPhoneConsent': new FormControl(null),
      'is_active': new FormControl(null),
      'professional_liability_policy_number': new FormControl(null,[Validators.required]),
      'npi_number': new FormControl(null, [Validators.required]),
      'dea_number': new FormControl(null, [Validators.required]),
      'order_batch_size': new FormControl(null, [Validators.required]),
      'consultation_batch_size': new FormControl(null, [Validators.required]),
      'professional_liability_document': new FormControl(null),
      'professional_liability_document_expiry_date': new FormControl(null,[Validators.required]),
      'practice_addresses': new FormArray([]),
      'licenses': new FormArray([]),
      'add_memo_tab': new FormControl(null)
    });
  }

  ngOnInit(){
    this._getStates();
    this.getDoctorDetails();
  }

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
  get residential_zipcode() { return this.addDoctor.get('residential_zipcode'); }
  get cell_phone_number() { return this.addDoctor.get('cell_phone_number'); }

  get emailPhoneConsent() { return this.addDoctor.get('emailPhoneConsent'); }
  get is_active() { return this.addDoctor.get('is_active'); }
  get add_memo_tab() { return this.addDoctor.get('add_memo_tab'); }

  get npi_number() { return this.addDoctor.get('npi_number'); }
  get dea_number() { return this.addDoctor.get('dea_number'); }
  get order_batch_size() { return this.addDoctor.get('order_batch_size'); }
  get consultation_batch_size() { return this.addDoctor.get('consultation_batch_size'); }

  get professional_liability_policy_number() { return this.addDoctor.get('professional_liability_policy_number'); }
  get professional_liability_document() { return this.addDoctor.get('professional_liability_document'); }
  get professional_liability_document_expiry_date() { return this.addDoctor.get('professional_liability_document_expiry_date'); }

  getLicensesControls() {
    return (this.addDoctor.get('licenses') as FormArray)['controls'];
  }

  getPracticeAddresses() {
    return (this.addDoctor.get('practice_addresses') as FormArray)['controls'];
  }

  /**
   * Retrieves Doctor Details to be edited
   */
  public getDoctorDetails() {
    const url = 'api/doctors/details/' + this.doctorId;
    this.http.get(url)
      .subscribe((doctor: any) => {
        this.doctorObj=doctor;
        this.addDoctor.patchValue({
          id : doctor.id,
          company_name : doctor.company_name,
          llc_name : doctor.llc_name,
          check_payable_to_name : doctor.check_payable_to_name,
          first_name : doctor.first_name,
          last_name : doctor.last_name,
          display_name : doctor.display_name,
          fax_number :doctor.fax_number,
          gender : doctor.gender,
          email : doctor.email,
          date_of_birth : doctor.date_of_birth,

          residential_address_1:doctor.residential_address.address_line_1,
          residential_address_2:doctor.residential_address.address_line_2,
          residential_city:doctor.residential_address.city_name,
          residential_state_id:doctor.residential_address.state_id,
          residential_zipcode:doctor.residential_address.zip_code,

          cell_phone_number:doctor.cell_phone_number,
          emailPhoneConsent: doctor.emailPhoneConsent,
          is_active: doctor.is_active,
          add_memo_tab:doctor.add_memo_tab,

          professional_liability_policy_number:doctor.professional_liability_policy_number,
          professional_liability_document_expiry_date:doctor.professional_liability_document_expiry_date,
          npi_number:doctor.npi_number,
          dea_number:doctor.dea_number,
          order_batch_size:doctor.order_batch_size,
          consultation_batch_size:doctor.consultation_batch_size
        });
        this.cdr.detectChanges();
         this.doctorObj.practice_addresses.forEach((address:any) => {
          let address2 = address.address_line_2?address.address_line_2:null;
          const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
          const addControl = new FormGroup({
            'address_line1': new FormControl(address.address_line_1, [Validators.required]),
            'address_line2': new FormControl(address2),
            'city_name': new FormControl(address.city_name, [Validators.required]),
            'state_id': new FormControl(address.state_id, [Validators.required]),
            'zipcode': new FormControl(address.zip_code, [Validators.required]),
            'is_active': new FormControl(address.is_active, []),
          });
          addressControl.push(addControl);
        });
        this.doctorObj.licenses.forEach((licanse:any) => {
          const licenseControl = this.addDoctor.get('licenses') as FormArray;
          const liceControl = new FormGroup({
            'license_number': new FormControl(licanse.license_number, [Validators.required]),
            'expiry_date': new FormControl(licanse.expiry_date, [Validators.required]),
            'state_id': new FormControl(licanse.state_id, [Validators.required]),
            'is_active': new FormControl(licanse.is_active),
          });
          licenseControl.push(liceControl);
        });
      }, err => {

      });
    this.cdr.detectChanges();
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

  onFileSelect(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.professionalLiabilityDocument = file;
    }
  }

  saveDoctor() {
    if (this.hasPracticeAddressLengthError() || this.addDoctor.invalid) {
      this.markFormGroupTouched(this.addDoctor);
      return;
    }

    const fd: FormData = new FormData();
    fd.append('doctor', JSON.stringify(this.addDoctor.value));
    if(this.professionalLiabilityDocument){
      fd.append('professional_liability_document',this.professionalLiabilityDocument);
    }else{
      fd.append('professional_liability_document',this.doctorObj.professional_liability_document);
    }
    const url = 'api/doctors/update';
    const data = fd;
    this.http.post(url, data).subscribe(
      (res: any) => {
        if (res != null) {
          if (res.errno != null) {
            this.toastr.showError(res.sqlMessage);
          } else {
            this.router.navigate(['/admin/doctors/list']);
            this.toastr.showSuccess('Update Successfully');
          }
        }
      },
      err => {
        this.toastr.showError('Unable to edit doctor.');

      }
    );
  }

  private async _getStates() {
    const url = 'api/system_states/all';
    this.http.get(url).subscribe((data: any) => {
        this.states = data;
      },
      (err) => {
      }
    );
  }

  public getStateList(currentStateId: number) {
    let selectedStateIds = this.addDoctor.get('licenses')?.value.map((e: any) => e.state_id)
    selectedStateIds.splice(selectedStateIds.indexOf(currentStateId), 1)
    var filtered = this.states.filter(({ id }) => !selectedStateIds.includes(id));
    return filtered;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control:any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
