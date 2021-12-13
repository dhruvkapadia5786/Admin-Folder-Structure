import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Lightbox } from 'ngx-lightbox';
import { Toastr } from 'src/app/services/toastr.service';
import {ClinicService} from '../../clinic/clinic.service';

@Component({
  selector: 'app-account-request-view',
  templateUrl: './account-request-view.component.html',
  styleUrls: ['./account-request-view.component.scss']
})
export class AccountRequestViewComponent implements OnInit{

  states:any[]=[];
  doctorId: any;
  doctorDetails: any;
  practice_addresses:any;
  licenses:any;
  clinic:any;

  loading=false;
  btnLoading=false;

  imageUrl: any = '../../../../assets/img/no-image.png';
  _albums = [{
    src: this.imageUrl,
    caption: 'License image',
    thumb: this.imageUrl
  }];


  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private clinicService:ClinicService,
    private router: Router,
    private _toastr:Toastr,
    private sanitizer: DomSanitizer,
    private _lightbox: Lightbox
  ) {
    this.doctorId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this._getStates();
    this.getDoctorDetails();
  }

  async getImage(path: string) {
    await this.http.post('api/document/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
      const fr = new FileReader();
      fr.readAsDataURL(result);
      fr.onloadend = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(fr.result + '');
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'License image',
          thumb: this.imageUrl
        });
      }
    })
      .catch(err => {
        this.imageUrl = 'assets/img/no-image.png';
        this._albums = [];
        this._albums.push({
          src: this.imageUrl,
          caption: 'License image',
          thumb: this.imageUrl
        });
        //
      })
  }


  getDoctorDetails() {
    this.loading=true;
    const url = 'api/doctor_account_requests/view/' + this.doctorId;
    this.http.get(url).subscribe((doctor: any) => {
        this.doctorDetails = doctor;
        if(doctor.selected_clinic_id){
          this.getClinicDetails(doctor.selected_clinic_id);
        }
        this.practice_addresses = JSON.parse(doctor.practice_addresses);
        this.licenses= JSON.parse(doctor.licenses);
        if (this.doctorDetails.professional_liability_document) {
          this.getImage(this.doctorDetails.professional_liability_document);
        }
        this.loading=false;
      }, err => {
        this.loading=false;

      });
  }

  async getClinicDetails(clinicId:number){
    let details:any = await this.clinicService.viewClinicByDoesspotClinicId(clinicId).catch((e:any)=>e);
    this.clinic = details;
  }

  async _getStates() {
    const url = 'api/states/active';
    this.http.get(url).subscribe(
      (data: any) => {
        this.states = data;
      },
      (err) => { }
    );
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

  getGender(data:number){
    if(data==1){return 'Male';}
    else {return 'Female';}
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

  findStateNameById(state_id:number){
    let stateFound=this.states.find((state:any)=>{return state.id==state_id});
    return stateFound.name;
  }

  open(): void {
    this._lightbox.open(this._albums, 0, { centerVertically: true });
  }

  close(){
    this._lightbox.close();
  }
}
