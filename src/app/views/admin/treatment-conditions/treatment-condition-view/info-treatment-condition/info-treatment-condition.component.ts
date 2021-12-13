import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-info-treatment-condition',
  templateUrl: './info-treatment-condition.component.html',
  styleUrls: ['./info-treatment-condition.component.scss']
})
export class InfoTreatmentConditionComponent implements OnInit, OnDestroy {
  conditionDetails: any;
  conditionId: any;
  imageUrl: any = '../../../../../../../assets/img/no_preview.png'

  routeSubscribe: any;
  constructor(
    private router: Router,
    private _http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _toastr:Toastr,
    private _changeDetectorRef: ChangeDetectorRef){

    let activeRoute:any = this.route;
        if(activeRoute){
          this.conditionId = activeRoute.parent.parent.snapshot.paramMap.get('treatment_condition_id');
          this.getTreatmentConditionDetails();
    }

  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
  }

  async getTreatmentConditionDetails(){
    let url = `api/treatment_conditions/view/${this.conditionId}`;
    this._http.get(url).subscribe((result: any) => {
      if (result && result._id) {
        this.conditionDetails = result;
        this.getImage(result.image_url, 'LOGO');
      }
    },(err:any) => {
      this.imageUrl = '../../../../../../assets/img/no_preview.png';
    })
  }

  getImage(path:string, type: string){
    this._http.post('api/documents/preview', { path: path }, { responseType: 'blob' }).toPromise().then((result) => {
      const fr = new FileReader();
      fr.readAsDataURL(result);
      fr.onloadend = () => {
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(fr.result + '');
      }
      }).catch((err:any) => {
        if (type == 'LOGO'){
          this.imageUrl = '../../../../../../assets/img/no_preview.png';
        }
      })
  }

  updateSequence (event: any) {
    let dataToSend: any = []
     event.data.forEach((obj: any) => {
        dataToSend.push({ ...obj.item, sequence:obj.sequence });
    });
    let url: string = `api/treatment_conditions/update_sequence/${this.conditionId}`;
    this._http.post(url, { mode: event.mode, sequences: dataToSend })
      .subscribe(data => {
        this.getTreatmentConditionDetails();
        this._toastr.showSuccess('Sequence Updated Successfully');
      }, err => {
        this._toastr.showError('Unable to update sequence. Please try again');
      });
  }
}
