import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-account-request-registration',
  templateUrl: './account-request-registration.component.html',
  styleUrls: ['./account-request-registration.component.scss']
})
export class AccountRequestRegistrationComponent implements OnInit {
  currentWizard: any;
  doctorId: any;
  loading: boolean = false;
  doctorDetails: any;

  step1Response: any;
  step2Response: any;
  step3Response: any;

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;


  constructor(public http: HttpClient,
    public cdr: ChangeDetectorRef,
    public route: ActivatedRoute,
    private toastr: Toastr,
    public router: Router) {
    this.doctorId = this.route.snapshot.paramMap.get('id');
    this.form1 = new FormGroup({});
    this.form2 = new FormGroup({});
    this.form3 = new FormGroup({});
  }

  ngOnInit() {
    this.getDoctorDetails();
  }

  public getDoctorDetails() {
    let that = this;
    this.loading = true;
    const url = 'api/doctor_account_requests/view/' + this.doctorId;
    this.http.get(url).subscribe((doctor: any) => {
      this.loading = false;
      this.doctorDetails = doctor;
      if (this.doctorDetails.step_1_doesspot_account == 1 && this.doctorDetails.step_1_teledaddy_account == 1 && (this.doctorDetails.step_2_doesspot_clinic != 1 || this.doctorDetails.step_2_teledaddy_clinic != 1) && (this.doctorDetails.step_3_doesspot_clinic_doctor_linking != 1 || this.doctorDetails.step_3_teledaddy_clinic_doctor_linking != 1)) {
        that.gotoWizard(1);
      } else if (this.doctorDetails.step_1_doesspot_account == 1 && this.doctorDetails.step_1_teledaddy_account == 1 && this.doctorDetails.step_2_doesspot_clinic == 1 && this.doctorDetails.step_2_teledaddy_clinic == 1 && (this.doctorDetails.step_3_doesspot_clinic_doctor_linking != 1 || this.doctorDetails.step_3_teledaddy_clinic_doctor_linking != 1)) {
        if (this.doctorDetails.selected_clinic_id) {
          that.gotoWizard(1);
        } else {
          that.gotoWizard(2);
        }
      }
      else if (this.doctorDetails.step_1_doesspot_account == 1 && this.doctorDetails.step_1_teledaddy_account == 1 && this.doctorDetails.step_2_doesspot_clinic == 1 && this.doctorDetails.step_2_teledaddy_clinic == 1 && this.doctorDetails.step_3_doesspot_clinic_doctor_linking == 1 && this.doctorDetails.step_3_teledaddy_clinic_doctor_linking == 1) {
        if (this.doctorDetails.selected_clinic_id) {
          that.gotoWizard(2);
        } else {
          that.gotoWizard(3);
        }
      } else {
        that.gotoWizard(0);
      }
    });
  }

  registrationStep(event: any, currentStep: number) {
    event.preventDefault();
    this.loading = true;
    const url = `api/doctor_account_requests/registration/${this.doctorId}/${currentStep}`;
    this.http.post(url, {}).subscribe((response: any) => {
      if (currentStep == 1) {
        this.step1Response = response ? JSON.stringify(response) : '';
      }
      if (currentStep == 2) {
        this.step2Response = response ? JSON.stringify(response) : '';
      }
      if (currentStep == 3) {
        this.step3Response = response ? JSON.stringify(response) : '';
      }

      this.loading = false;
      this.getDoctorDetails();
    });
  }

  gotoNextStep(currentStep: number) {
    if (currentStep == 1) {
      if (this.doctorDetails.step_1_doesspot_account == 1 && this.doctorDetails.step_1_teledaddy_account == 1) {
        if (this.doctorDetails.selected_clinic_id) {
          this.gotoWizard(2);
        } else {
          this.gotoWizard(1);
        }
      } else {
        return;
      }
    }

    if (currentStep == 2) {
      if (this.doctorDetails.step_2_doesspot_clinic == 1 && this.doctorDetails.step_2_teledaddy_clinic == 1) {
        this.gotoWizard(2);
      } else {
        return;
      }
    }

    if (currentStep == 3) {
      if (this.doctorDetails.step_3_doesspot_clinic_doctor_linking == 1 && this.doctorDetails.step_3_teledaddy_clinic_doctor_linking == 1) {
        this.gotoWizard(3);
      } else {
        return;
      }
    }
  }

  gotoWizard(step: number) {
    this.currentWizard = 'WIZARD_' + step;
  }


}
