import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Helper } from 'src/app/services/helper.service';
import { ActivatedRoute } from '@angular/router';
import { ClinicService } from '../clinic.service';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { DoctorModalComponent } from '../doctor-modal/doctor-modal.component';
import { DoctorModalService } from '../doctor-modal/doctor-modal.service';

@Component({
  selector: 'app-view-clinic',
  templateUrl: './view-clinic.component.html',
  styleUrls: ['./view-clinic.component.scss']
})
export class ViewClinicComponent implements OnInit, AfterViewInit {
  modalRef!: BsModalRef;
  clinicId: any;
  clinic: any;
  doctors: any[] = [];
  doctorList: any[] = [];
  query: string = '';
  doctorRole: string = 'CLINIC_DOCTOR';
  selectedDoctor: any = null;
  selectedDoctorId: any = null;
  loading: boolean = false;

  doesspot_notification_counts: any;
  doesspot_error_notification: any;

  dtOptions: any = {};
  patientsTableData = new Array<any>();
  totalPatients: number = 0;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  constructor(public _helper: Helper,
    private _activeRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private http: HttpClient,
    private clinicService: ClinicService,
    private modalService: BsModalService,
    private _doctorModalService: DoctorModalService) {
    this.clinicId = this._activeRoute.snapshot.paramMap.get('id');
  }

  ngAfterViewInit(): void {

  }

  async ngOnInit() {
    await this.loadDetails();
    this.getDoctorsList();
  }

  async loadDetails() {
    let details: any = await this.clinicService.viewClinic(this.clinicId).catch((e: any) => e);
    this.clinic = details;
    this._cdr.detectChanges();
  }

  getDoctorsList() {
    let url = 'api/v1/admin/clinics/all_doctors_list';
    this.http.get(url).subscribe((res: any) => {
      this.doctorList = res.filter((doc: any) => {
        return this.clinic.doctors.filter((clinic_doctor: any) => { return clinic_doctor.is_deleted != 1 && clinic_doctor.teledaddyuser_ptr_id == doc.teledaddyuser_ptr_id }).length > 0 ? false : true;
      });
    }, (err: any) => {

    });
  }

  manageAccountService(doctorId: number, account_service_enabled: any) {
    let url = 'api/v1/admin/doctors/manage_account_service';
    this.http.post(url, {
      doctor_id: doctorId,
      status: account_service_enabled == 0 ? 1 : 0
    }).subscribe((res: any) => {
      this.loadDetails();
    }, (err: any) => {

    });
  }

  manageAccountUsage(doctorId: number, is_active: any) {
    let url = 'api/v1/admin/doctors/manage_account_usage';
    this.http.post(url, {
      doctor_id: doctorId,
      status: is_active == 0 ? 1 : 0
    }).subscribe((res: any) => {
      this.loadDetails();
    }, (err: any) => {

    });
  }

  removeFromClinic(doesspot_clinic_id: number, doctor_id: number, doctor_doesspot_id: number) {
    let url = 'api/v1/doesspot/removeClinicianFromClinic';
    this.http.post(url, {
      doctor_id: doctor_id,
      doesspot_clinic_id: doesspot_clinic_id,
      doesspot_clinician_id: doctor_doesspot_id
    }).subscribe((res: any) => {
      this.loadDetails();
    }, (err: any) => {
    });
  }

  openModal() {
    // modal.show();
    this._doctorModalService.setData({})
    this.modalRef = this.modalService.show(DoctorModalComponent) /* {class: 'modal-x-lg'} */
  }

  setDoctor(doctor: any) {
    this.selectedDoctor = doctor;
    this.selectedDoctorId = doctor.teledaddyuser_ptr_id;
  }

  setDoctorNOpenModal(doctor: any) {
    this.setDoctor(doctor);
    this.openModal();
    this.doctorRole = doctor.doctor_role;
  }

}
