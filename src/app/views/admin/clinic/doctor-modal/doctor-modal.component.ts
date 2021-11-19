import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DoctorModalService } from './doctor-modal.service';

@Component({
  selector: 'app-doctor-modal',
  templateUrl: './doctor-modal.component.html',
  styleUrls: ['./doctor-modal.component.scss']
})
export class DoctorModalComponent implements OnInit {

  clinic: any;
  doctorList: any[] = [];
  query: string = '';
  doctorRole: string = 'CLINIC_DOCTOR';
  selectedDoctor: any = null;
  selectedDoctorId: any = null;
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private _doctorModalService : DoctorModalService
  ) { }

  ngOnInit(): void {
    let details = this._doctorModalService.getData();
    console.log('details from parent :: ', details)
  }

  addToClinic(doesspot_clinic_id: number, doesspot_clinic_key: string, doctor_id: number, doctor_doesspot_id: number) {
    this.loading = true;
    const url = 'api/v1/doesspot/linkClinicianToClinic';
    this.http.post(url, { doctor_role: this.doctorRole, doctor_id: doctor_id, clinicianId: doctor_doesspot_id, ClinicIds: [doesspot_clinic_id], clinicKey: doesspot_clinic_key })
      .subscribe((response: any) => {
        this.loading = false;
        this.selectedDoctor = null;
        this.selectedDoctorId = null;
        
        /* EMIT AND CALL THIS TWO METHOD FROM  */
        /* this.loadDetails();
        this.getDoctorsList(); */
        // modal.hide();
      }, err => {
        this.loading = false;

      });
  }

  setDoctor(doctor: any) {
    this.selectedDoctor = doctor;
    this.selectedDoctorId = doctor.teledaddyuser_ptr_id;
  }

}
