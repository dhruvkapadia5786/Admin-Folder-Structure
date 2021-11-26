import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Toastr } from '../../../../services/toastr.service';

@Component({
  selector: 'app-account-request-edit',
  templateUrl: './account-request-edit.component.html',
  styleUrls: ['./account-request-edit.component.scss']
})
export class AccountRequestEditComponent implements OnInit {
  doctorId: any;
  doctorObj: any;
  addDoctor: FormGroup
  licenses!: FormGroup;
  practice_addresses!: FormGroup;
  professionalLiabilityDocument!: File;

  public addressError: boolean = false;
  public licenseError: boolean = false;
  public states: any;
  public speciality_paths: any[] = [];
  public treatmentConditionsList: any;
  public portalusages: any[] =
    [
      { name: 'ONLY_DTC', type: 'DTC' },
      { name: 'ONLY_PERSONAL_PATIENTS_CONSULTATION', type: 'CONSULTATION' },
      { name: 'ONLY_GENERAL_CONSULTATION', type: 'CONSULTATION' },
      { name: 'DTC_WITH_PERSONAL_PATIENTS_CONSULTATION', type: 'DTC_CONSULTATION' },
      { name: 'DTC_WITH_GENERAL_CONSULTATION', type: 'DTC_CONSULTATION' },
      { name: 'CONSULT_ALL_PATIENTS_INCLUDING_PERSONAL', type: 'CONSULTATION' },
      { name: 'DTC_WITH_ALL_CONSULTATION', type: 'DTC_CONSULTATION' }
    ];
  filteredPortalUsage: any = [];

  constructor(public http: HttpClient,
    public cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private toastr: Toastr,
    public router: Router) {
    this.doctorId = this.route.snapshot.paramMap.get('id');

    this.addDoctor = new FormGroup({
      'id': new FormControl(null, [Validators.required]),
      'conditions': new FormControl(null, []),
      'specialities': new FormArray([]),
      'company_name': new FormControl(null, [Validators.required]),
      'llc_name': new FormControl(null, [Validators.required]),
      'check_payable_to_name': new FormControl(null, [Validators.required]),
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'suffix': new FormControl(null, [Validators.required]),
      'display_name': new FormControl(null, [Validators.required]),
      'fax_number': new FormControl(null, [Validators.required]),
      'gender': new FormControl(null),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'dateOfBirth': new FormControl(null, [Validators.required]),
      'residential_address_1': new FormControl(null, [Validators.required]),
      'residential_address_2': new FormControl(null),
      'residential_city': new FormControl(null, [Validators.required]),
      'residential_state_id': new FormControl(null, [Validators.required]),
      'residential_zipcode': new FormControl(null, [Validators.required]),
      'cell_phone_number': new FormControl(null, [Validators.required]),
      'emailPhoneConsent': new FormControl(null),
      'is_active': new FormControl(true),
      'professional_liability_policy_number': new FormControl(null, [Validators.required]),
      'npi_number': new FormControl(null, [Validators.required]),
      'dea_number': new FormControl(null, [Validators.required]),
      'consultation_batch_size': new FormControl(null, [Validators.required]),
      'order_batch_size': new FormControl(null, [Validators.required]),
      'rate_per_prescription': new FormControl(null, [Validators.required]),
      'professional_liability_document': new FormControl(null),
      'professional_liability_document_expiry_date': new FormControl(null, [Validators.required]),
      'practice_addresses': new FormArray([]),
      'licenses': new FormArray([]),
      'add_memo_tab': new FormControl(null),
      'service_type': new FormControl(null, [Validators.required]),
      'portal_usage': new FormControl(null, [Validators.required])
    });
    this.setConditionAndSpecialityValidators();
  }

  ngOnInit() {
    this._getStates();
    this.getAllSpecialityPaths();
    this.getActiveTreatmentConditionList();
    this.getDoctorDetails();
  }

  specialities(): FormArray {
    return this.addDoctor.get("specialities") as FormArray
  }

  all_specialities(spIndex: number): FormArray {
    return this.specialities().at(spIndex).get("all_specialities") as FormArray
  }

  getServiceTypeFromPortalUsage(portalUsage: any) {
    let itemFound = this.portalusages.find((item: any) => item.name == portalUsage)
    return itemFound.type;
  }

  filterOutPortalUsage(value: any) {
    this.filteredPortalUsage = this.portalusages.filter((pu: any) => pu.type == value);
  }


  public getActiveTreatmentConditionList() {
    const url = 'api/v1/admin/conditions/active';
    this.http.get(url).subscribe((conditionsList: any) => {
      if (conditionsList != null) {
        this.treatmentConditionsList = conditionsList;
      }
    }, err => {

    });
  }

  private async getAllSpecialityPaths() {
    const url = 'api/v1/admin/consultation/speciality_paths';
    this.http.get(url).subscribe(
      (data: any) => {
        this.speciality_paths = data;

        for (let path of this.speciality_paths) {

          let specialityControlArray = [];
          for (let item of path.specialities) {
            specialityControlArray.push(new FormGroup({
              speciality_path_id: new FormControl(item.id),
              is_checked: new FormControl(false),
              speciality_id: new FormControl(item.speciality_id),
              speciality_name: new FormControl(item.speciality_name),
              speciality_code: new FormControl(item.speciality_code),
              speciality_path: new FormControl(item.speciality_path),
            }));
          }
          let obj = new FormGroup({
            'speciality_path_id': new FormControl(path.id),
            'path': new FormControl(path),
            'is_checked': new FormControl(false),
            'all_specialities': new FormArray(specialityControlArray)
          });
          this.specialities().push(obj);
        }
      },
      (err) => {
      });
  }


  get id() { return this.addDoctor.get('id'); }
  get conditions() { return this.addDoctor.get('conditions'); }
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
  get dateOfBirth() { return this.addDoctor.get('dateOfBirth'); }

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

  get rate_per_prescription() { return this.addDoctor.get('rate_per_prescription'); }

  get professional_liability_policy_number() { return this.addDoctor.get('professional_liability_policy_number'); }
  get professional_liability_document() { return this.addDoctor.get('professional_liability_document'); }
  get professional_liability_document_expiry_date() { return this.addDoctor.get('professional_liability_document_expiry_date'); }

  get service_type() { return this.addDoctor.get('service_type'); }
  get portal_usage() { return this.addDoctor.get('portal_usage'); }



  public changeSpecialityPath(checked: boolean, pathIndex: number) {
    this.specialities().at(pathIndex).patchValue({
      is_checked: checked
    });
    for (let i = 0; i < this.all_specialities(pathIndex).length; i++) {
      this.all_specialities(pathIndex).at(i).patchValue({
        is_checked: checked
      });
    }
  }

  public addRemoveSpeciality(checked: boolean, specialityIndex: number, pathIndex: number) {
    if (checked) {
      this.specialities().at(pathIndex).patchValue({
        is_checked: checked
      });
    }

    this.all_specialities(pathIndex).at(specialityIndex).patchValue({
      is_checked: checked
    });

    if (!checked && this.all_specialities(pathIndex).value.filter((item: any) => item.is_checked).length == 0) {
      this.specialities().at(pathIndex).patchValue({
        is_checked: checked
      });
    }
  }

  handleChangeSpecialityPath(event: any, pathIndex: number) {
    this.changeSpecialityPath(event.checked, pathIndex);
  }

  handleChangeSpeciality(event: any, specialityIndex: number, pathIndex: number) {
    this.addRemoveSpeciality(event.checked, specialityIndex, pathIndex);
  }

  /**
   * Retrieves Doctor Details to be edited
   */
  public getDoctorDetails() {
    const url = 'api/doctor_account_requests/view/' + this.doctorId;
    this.http.get(url)
      .subscribe((doctor: any) => {
        this.doctorObj = doctor;
        let conditionIds = doctor.service_type && (doctor.service_type == 'DTC' || doctor.service_type == 'DTC_CONSULTATION') && doctor.treatment_conditions ? JSON.parse(doctor.treatment_conditions) : [];
        if (doctor.service_type) {
          this.filterOutPortalUsage(doctor.service_type);
        } else {
          this.filterOutPortalUsage('CONSULTATION');
        }

        this.addDoctor.patchValue({
          id: doctor.id,
          conditions: conditionIds,

          company_name: doctor.company_name,
          llc_name: doctor.llc_name,
          check_payable_to_name: doctor.check_payable_to_name,
          first_name: doctor.first_name,
          last_name: doctor.last_name,
          display_name: doctor.display_name,
          fax_number: doctor.fax_number,
          gender: doctor.gender,
          email: doctor.email,
          dateOfBirth: moment(doctor.dateOfBirth, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          residential_address_1: doctor.residential_address_1,
          residential_address_2: doctor.residential_address_2,
          residential_city: doctor.residential_city,
          residential_state_id: doctor.residential_state_id,
          residential_zipcode: doctor.residential_zipcode,

          cell_phone_number: doctor.cell_phone_number,
          emailPhoneConsent: doctor.emailPhoneConsent,
          is_active: doctor.is_active ? doctor.is_active : true,
          add_memo_tab: doctor.add_memo_tab,

          professional_liability_policy_number: doctor.professional_liability_policy_number,
          professional_liability_document_expiry_date: doctor.professional_liability_document_expiry_date,
          npi_number: doctor.npi_number,
          dea_number: doctor.dea_number,
          order_batch_size: doctor.order_batch_size ? doctor.order_batch_size : 10,
          rate_per_prescription: doctor.rate_per_prescription,
          consultation_batch_size: doctor.consultation_batch_size ? doctor.consultation_batch_size : 10,
          service_type: doctor.service_type ? doctor.service_type : 'CONSULTATION',
          portal_usage: doctor.portal_usage ? doctor.portal_usage : 'CONSULT_ALL_PATIENTS_INCLUDING_PERSONAL'
        });

        let practice_addresses = JSON.parse(doctor.practice_addresses);
        let licenses = JSON.parse(doctor.licenses);
        let doctor_specialities = doctor.doctor_specialities ? JSON.parse(doctor.doctor_specialities) : [];
        practice_addresses.forEach((address: any) => {
          const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
          const addControl = new FormGroup({
            'address_line_1': new FormControl(address.address_line_1, [Validators.required]),
            'address_line_2': new FormControl(address.address_line_2),
            'city_name': new FormControl(address.city_name, [Validators.required]),
            'state_id': new FormControl(address.state_id, [Validators.required]),
            'zip_code': new FormControl(address.zip_code, [Validators.required]),
            'is_active': new FormControl(address.is_active, []),
          });
          addressControl.push(addControl);
        });

        licenses.forEach((licanse: any) => {
          const licenseControl = this.addDoctor.get('licenses') as FormArray;
          const liceControl = new FormGroup({
            'license_number': new FormControl(licanse.license_number, [Validators.required]),
            'expiry_date': new FormControl(licanse.expiry_date, [Validators.required]),
            'state_id': new FormControl(licanse.state_id, [Validators.required]),
            'is_active': new FormControl(licanse.is_active),
          });
          licenseControl.push(liceControl);
        });

        if (doctor_specialities) {
          doctor_specialities.forEach((speciality: any) => {
            let pathIndex = this.specialities().value.findIndex((item: any) => item.speciality_path_id == speciality.speciality_path_id);
            this.specialities().at(pathIndex).patchValue({
              is_checked: true
            });
            for (let i = 0; i < this.all_specialities(pathIndex).length; i++) {
              if (speciality.speciality_id == this.all_specialities(pathIndex).at(i).value.speciality_id) {
                this.all_specialities(pathIndex).at(i).patchValue({
                  is_checked: true
                });
              }
            }
          });
        }

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

  get specialitiesGroup(): FormGroup {
    return new FormGroup({
      'speciality_path_id': new FormControl(null, [Validators.required]),
      'is_checked': new FormControl(null),
      'all_specialities': new FormArray([])
    });
  }

  getLicensesControls() {
    return (this.addDoctor.get('licenses') as FormArray)['controls'];
  }

  getPracticeAddresses() {
    return (this.addDoctor.get('practice_addresses') as FormArray)['controls'];
  }

  setConditionAndSpecialityValidators() {

    const conditionsControl: any = this.addDoctor.get('conditions');
    const specialitiesControl: any = this.addDoctor.get("specialities");

    this.addDoctor.get('service_type')?.valueChanges.subscribe(selectedOption => {
      if (selectedOption == 'DTC') {
        conditionsControl.setValidators([Validators.required]);
        conditionsControl.updateValueAndValidity();

        specialitiesControl.clearValidators();
        specialitiesControl.updateValueAndValidity();

      } else if (selectedOption == 'CONSULTATION') {

        specialitiesControl.setValidators([this.atLeastOneCheckboxCheckedValidator()]);
        specialitiesControl.updateValueAndValidity();

        conditionsControl.clearValidators();
        conditionsControl.updateValueAndValidity();

      } else {
        specialitiesControl.setValidators([this.atLeastOneCheckboxCheckedValidator()]);
        specialitiesControl.updateValueAndValidity();

        conditionsControl.setValidators([Validators.required]);
        conditionsControl.updateValueAndValidity();
      }
    });
  }

  atLeastOneCheckboxCheckedValidator(minRequired = 1) {
    return function validate(formGroup: FormGroup) {
      let checked = 0
      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key]
        if (control.value.is_checked) {
          checked++
        }
      })
      if (checked < minRequired) {
        return {
          requireCheckboxToBeChecked: true,
        }
      }
      return null
    }
  }

  public addNewPracticeAddress() {
    const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
    addressControl.push(this.practiceAddresses);
    this.hasPracticeAddressLengthError();
  }

  public removeAddress(index: number) {
    const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
    addressControl.removeAt(index);
    this.hasPracticeAddressLengthError();
  }

  public hasPracticeAddressLengthError() {
    const addressControl = this.addDoctor.get('practice_addresses') as FormArray;
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
    this.hasPracticeAddressLengthError();
  }

  public removeLicense(index: number) {
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


  onFileSelect(event: any) {
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
    if (this.professionalLiabilityDocument) {
      fd.append('professional_liability_document', this.professionalLiabilityDocument);
    } else {
      fd.append('professional_liability_document', this.doctorObj.professional_liability_document);
    }
    const url = 'api/doctor_account_requests/update/' + this.doctorId;
    const data = fd;
    this.http.post(url, data).subscribe(
      (res: any) => {
        if (res != null) {
          if (res.errno != null) {
            this.toastr.showError(res.sqlMessage);
          } else {
            this.router.navigate(['/admin/account-request/view', this.doctorId]);
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
    const url = 'api/v1/admin/states/active';
    this.http.get(url).subscribe(
      (data: any) => {
        this.states = data;
      },
      (err) => {
      }
    );
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}

