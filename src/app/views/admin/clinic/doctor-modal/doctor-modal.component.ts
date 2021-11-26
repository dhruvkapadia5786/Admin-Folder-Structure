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

  addToClinic(clinic_id: any,doctor_id: any) {
    this.loading = true;
    const url = 'api/v1/doesspot/linkClinicianToClinic';
    this.http.post(url, { clinic_id:clinic_id , doctor_id: doctor_id}).subscribe((response: any) => {
        this.loading = false;
        this.selectedDoctor = null;
        this.selectedDoctorId = null;

      }, err => {
        this.loading = false;

      });
  }

}
