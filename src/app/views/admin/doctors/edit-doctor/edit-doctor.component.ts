import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from '../../../../services/toastr.service';
import * as moment from 'moment';

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
  profilePhotoFile!:File;
  registrationCopyFile?:File;

  maxDate: Date = new Date();
  bsConfig={
    isAnimated: true,
    dateInputFormat: 'DD-MM-YYYY',
  }
  public addressError: boolean = false;
  public licenseError: boolean = false;
  public states: any[]=[];
  public treatmentConditionsList: any=[];
  public consultationHealthConditionsList: any=[];

  designationArray=['Medical Superintendent', 'Deputy Medical superintendent', 'Chief Medical Officer', 'Senior Medical Officer', 'Medical Officer', 'Director', 'Principal', 'General Physician', 'Surgeon', 'Others'];
  disciplineArray=['Allopathy', 'Dental', 'Ayurveda', 'Yoga', 'Naturopathy', 'Unani', 'Siddha', 'Homeopathy', 'Sowa- Rigpa', 'Others'];
  registrationWithArray=['Medical Council of India (MCI)', 'Dental Council of India (DCI)', 'Central Council of Indian Medicine', 'Central Council of Homeopathy (CCH)', 'State Medical Councils/Boards', 'Other'];

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
      'treatment_conditions': new FormControl(null, []),
      'consultation_health_conditions': new FormControl(null,[]),
      'first_name': new FormControl(null, [Validators.required]),
      'middle_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'prefix': new FormControl(null, [Validators.required]),
      'suffix': new FormControl(null, [Validators.required]),
      'display_name': new FormControl(null, [Validators.required]),
      'fax_number':new FormControl(null, [Validators.required]),
      'gender': new FormControl(null,[Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'date_of_birth': new FormControl(null,[Validators.required]),
      'category': new FormControl(null, [Validators.required]),
      'designation': new FormControl(null,[Validators.required]),
      'discipline': new FormControl(null,[Validators.required]),
      'registration_with': new FormControl(null,[]),
      'registration_date': new FormControl(null, []),
      'registration_number': new FormControl(null, []),
      'registration_copy': new FormControl(null, []),
      'check_payable_to_name': new FormControl(null,[Validators.required]),
      'residential_address_1': new FormControl(null,[Validators.required]),
      'residential_address_2': new FormControl(null),
      'residential_city': new FormControl(null,[Validators.required]),
      'residential_state_id': new FormControl(null,[Validators.required]),
      'residential_zipcode': new FormControl(null,[Validators.required]),
      'cell_phone_number': new FormControl(null,[Validators.required]),
      'email_phone_consent': new FormControl(null),
      'is_active': new FormControl(null),
      'order_batch_size': new FormControl(null, [Validators.required]),
      'consultation_batch_size': new FormControl(null, [Validators.required]),
      'rate_per_prescription': new FormControl(null, [Validators.required]),
      'practice_addresses': new FormArray([]),
      'licenses': new FormArray([]),
      'add_memo_tab': new FormControl(null),
      'portal_usage': new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(){
    this._getStates();
    this.getActiveTreatmentConditionList();
    this.getActiveConsultationHealthConditionList();
    this.getDoctorDetails();
  }

  get id() { return this.addDoctor.get('id'); }
  get treatment_conditions() { return this.addDoctor.get('treatment_conditions'); }
  get consultation_health_conditions() { return this.addDoctor.get('consultation_health_conditions'); }

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

  get check_payable_to_name() { return this.addDoctor.get('check_payable_to_name'); }
  get category() { return this.addDoctor.get('category');}
  get designation(){ return this.addDoctor.get('designation');}
  get discipline()  { return this.addDoctor.get('discipline');}
  get registration_with() { return this.addDoctor.get('registration_with');}
  get registration_date() { return this.addDoctor.get('registration_date'); }
  get registration_number() { return this.addDoctor.get('registration_number'); }
  get registration_copy() { return this.addDoctor.get('registration_copy'); }

  get residential_address_1() { return this.addDoctor.get('residential_address_1'); }
  get residential_address_2() { return this.addDoctor.get('residential_address_2'); }
  get residential_city() { return this.addDoctor.get('residential_city'); }
  get residential_state_id() { return this.addDoctor.get('residential_state_id'); }
  get residential_zipcode() { return this.addDoctor.get('residential_zipcode'); }
  get cell_phone_number() { return this.addDoctor.get('cell_phone_number'); }

  get email_phone_consent() { return this.addDoctor.get('email_phone_consent'); }
  get is_active() { return this.addDoctor.get('is_active'); }
  get add_memo_tab() { return this.addDoctor.get('add_memo_tab'); }

  get order_batch_size() { return this.addDoctor.get('order_batch_size'); }
  get consultation_batch_size() { return this.addDoctor.get('consultation_batch_size'); }
  get rate_per_prescription() { return this.addDoctor.get('rate_per_prescription'); }
  get portal_usage() { return this.addDoctor.get('portal_usage'); }

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
    const url = 'api/doctors/view/' + this.doctorId;
    this.http.get(url)
      .subscribe((doctor: any) => {
        this.doctorObj=doctor;
        let treatmentConditionIds = doctor.treatment_conditions ? doctor.treatment_conditions.map((item:any)=>item.toString()):[];
        let healthConditionIds = doctor.consultation_health_conditions ? doctor.consultation_health_conditions.map((item:any)=>item.toString()):[];

        this.addDoctor.patchValue({
          id : doctor._id,

          treatment_conditions: treatmentConditionIds,
          consultation_health_conditions: healthConditionIds,

          prefix:doctor.prefix,
          suffix:doctor.suffix,
          first_name: doctor.first_name,
          middle_name: doctor.middle_name,
          last_name: doctor.last_name,
          display_name : doctor.professional_details.display_name,
          fax_number :doctor.professional_details.fax_number,
          gender : doctor.gender,
          email : doctor.email,
          date_of_birth: moment(doctor.date_of_birth, 'YYYY-MM-DDTHH:mm:ss').format('DD-MM-YYYY'),

          category:  doctor.professional_details.category,
          designation:  doctor.professional_details.designation,
          discipline:  doctor.professional_details.discipline,
          registration_with:  doctor.professional_details.registration_with,
          registration_date:  doctor.professional_details.registration_date,
          registration_number:  doctor.professional_details.registration_number,

          residential_address_1:doctor.default_address.address_line_1,
          residential_address_2:doctor.default_address.address_line_2,
          residential_city:doctor.default_address.city,
          residential_state_id:doctor.default_address.state_id,
          residential_zipcode:doctor.default_address.zip_code,

          cell_phone_number:doctor.cell_phone_number,
          email_phone_consent: doctor.email_phone_consent,
          is_active: doctor.is_active,
          add_memo_tab:doctor.add_memo_tab,

          order_batch_size:doctor.professional_details.order_batch_size,
          consultation_batch_size:doctor.professional_details.consultation_batch_size,
          rate_per_prescription: doctor.professional_details.rate_per_prescription,
          portal_usage: doctor.professional_details.portal_usage,
          check_payable_to_name: doctor.professional_details.check_payable_to_name

        });
         this.cdr.detectChanges();
         this.doctorObj.addresses.forEach((address:any) => {
          let address2 = address.address_line_2?address.address_line_2:null;
          const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
          const addControl = new FormGroup({
            'address_line_1': new FormControl(address.address_line_1, [Validators.required]),
            'address_line_2': new FormControl(address2),
            'city': new FormControl(address.city, [Validators.required]),
            'state_id': new FormControl(address.state_id, [Validators.required]),
            'zip_code': new FormControl(address.zip_code, [Validators.required]),
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

  saveDoctor() {
    if (this.hasPracticeAddressLengthError() || this.addDoctor.invalid) {
      this.markFormGroupTouched(this.addDoctor);
      return;
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
    }else{
      fd.append('profile_photo',this.doctorObj.profile_photo);
    }

    if(this.registrationCopyFile){
     fd.append('registration_copy',this.registrationCopyFile);
    }else{
      fd.append('registration_copy',this.doctorObj.registration_copy);
    }
    const url = 'api/doctors/update';
    const data = fd;
    this.http.post(url, data).subscribe((res: any) => {
            this.router.navigate(['/admin/doctors/list']);
            this.toastr.showSuccess('Update Successfully');
      },
      err => {
        this.toastr.showError('Unable to edit doctor.');
      }
    )}

  private async _getStates(){
    const url = 'api/system_states/all';
    this.http.get(url).subscribe((data: any) => {
        this.states = data;
      },
      (err) => {

      });
  }

  public getStateList(currentStateId: number) {
    let selectedStateIds = this.addDoctor.get('licenses')?.value.map((e: any) => e.state_id.toString())
    selectedStateIds.splice(selectedStateIds.indexOf(currentStateId), 1)
    var filtered = this.states.filter(({ _id }) => !selectedStateIds.includes(_id));
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
