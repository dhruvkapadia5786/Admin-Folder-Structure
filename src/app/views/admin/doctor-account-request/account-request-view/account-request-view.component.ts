import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Toastr } from 'src/app/services/toastr.service';
import {ClinicService} from '../../clinic/clinic.service';

@Component({
  selector: 'app-account-request-view',
  templateUrl: './account-request-view.component.html',
  styleUrls: ['./account-request-view.component.scss']
})
export class AccountRequestViewComponent implements OnInit{

  doctorId: any;
  doctorDetails: any;
  practice_addresses:any;
  licenses:any;
  clinic:any;

  loading=false;
  btnLoading=false;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private clinicService:ClinicService,
    private router: Router,
    private _toastr:Toastr,
    private sanitizer: DomSanitizer){
    this.doctorId = this.route.snapshot.params.id;
  }

  ngOnInit(){
    this.getDoctorDetails();
  }

  getDoctorDetails(){
    this.loading=true;
    const url = 'api/doctor_account_requests/view/' + this.doctorId;
    this.http.get(url).subscribe((doctor: any) => {
        this.doctorDetails = doctor;
        if(doctor.selected_clinic_id){
          this.getClinicDetails(doctor.selected_clinic_id);
        }
        this.practice_addresses = doctor.practice_addresses;
        this.licenses= doctor.licenses;
        this.loading=false;
      }, err => {
        this.loading=false;
      });
  }

  async getClinicDetails(clinicId:any){
    let details:any = await this.clinicService.viewClinicByDoesspotClinicId(clinicId).catch((e:any)=>e);
    this.clinic = details;
  }

  gotoEditAccountRequest(){
    this.router.navigate(['admin','account-request','edit',this.doctorId]);
  }

  async reject(){
    this.btnLoading=true;
    const url =  `api/doctor_account_requests/reject/${this.doctorId}`;
    this.http.post(url,{}).subscribe(
      (data:any) => {
        this.btnLoading=false;
        this.getDoctorDetails();
      },
      (err) => {
        this.btnLoading=false;
      }
    );
  }

  async deleteRequest() {
    this.btnLoading=true;
    const url =  `api/doctor_account_requests/delete/${this.doctorId}`;
    this.http.post(url,{}).subscribe(
      (data:any) => {
        this.btnLoading=false;
        this.getDoctorDetails();
      },
      (err) => {
        this.btnLoading=false;
       }
    );
  }


  async approve() {
    this.btnLoading=true;
    const url =  `api/doctor_account_requests/approve/${this.doctorId}`;
    this.http.post(url,{}).subscribe(
      (data:any) => {
        this.btnLoading=false;
        if(data && data.doctorId){
          this.router.navigate(['admin','doctors','view',data.doctorId]);
        }else{
          this._toastr.showError('Error Creating Doctor');
        }
      },
      (err) => {
        this._toastr.showError('Error Creating Doctor');
        this.btnLoading=false;
      }
    );
  }


}
