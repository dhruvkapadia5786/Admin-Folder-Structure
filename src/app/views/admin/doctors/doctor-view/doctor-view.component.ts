import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Helper } from '../../../../services/helper.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-doctor-view',
  templateUrl: './doctor-view.component.html',
  styleUrls: ['./doctor-view.component.scss']
})
export class DoctorViewComponent implements OnInit, AfterViewInit {
  doctorId: any;
  doctorHashId: any;
  doctorDetails: any;
  doctorUinqueNumber: any;
  imageUrl: any = '../../../../assets/img/no-image.png';

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private helper: Helper,
    private sanitizer: DomSanitizer
  ) {
    this.doctorId = this.route.snapshot.params.id;
    this.doctorHashId = this.doctorId;
    this.getDoctorDetails();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

  getDoctorDetails() {
    const url = 'api/doctors/view/' + this.doctorId;
    this.http.get(url)
      .subscribe((doctor: any) => {
        this.doctorDetails = doctor;
        if (this.doctorDetails.professional_liability_document) {
          this.getImage(this.doctorDetails.professional_liability_document);
        } else {
          this.imageUrl = 'assets/img/no-image.png';
        }
        this.getCutomerUniqueNumber(this.doctorId, this.doctorDetails.type);
      }, err => {
    });
  }

  getCutomerUniqueNumber(id: any, type: any) {
    this.doctorUinqueNumber = this.helper.getUserUniqueId(id, type);
  }

  async getImage(path: string) {
    await this.http.post('api/document/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
      const fr = new FileReader();
      fr.readAsDataURL(result);
      fr.onloadend = () => {
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(fr.result + '');
      }
    })
    .catch(err => {
      this.imageUrl = 'assets/img/no-image.png';
    })
  }
  tabEvents(event:any) {
    if ((event == 1) || (event == 2) || (event == 3)) {

    }
  }

  loginAsUser () {

  }

  manageAccountService(){
    let url = 'api/doctors/manage_account_service';
    this.http.post(url,{
      doctor_id:this.doctorId,
      status:this.doctorDetails.account_service_enabled==0?1:0
    }).subscribe((res: any) => {
        this.getDoctorDetails();
    },(err: any) => {

    });
  }

  manageAccountUsage(){
    let url = 'api/doctors/manage_account_usage';
    this.http.post(url,{
      doctor_id:this.doctorId,
      status:this.doctorDetails.is_active==0?1:0
    }).subscribe((res: any) => {
        this.getDoctorDetails();
    },(err: any) => {

    });
  }

}
