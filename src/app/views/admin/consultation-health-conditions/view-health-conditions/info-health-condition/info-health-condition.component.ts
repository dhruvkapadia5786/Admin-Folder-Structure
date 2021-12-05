import { Component, OnInit, ChangeDetectorRef ,ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { ConsultationHealthConditionsService } from '../../consultation-health-conditions.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-info-health-condition',
  templateUrl: './info-health-condition.component.html',
  styleUrls: ['./info-health-condition.component.scss']
})
export class InfoHealthConditionComponent implements OnInit, OnDestroy {
  environmentUrl: any = environment
  healthCondition: any;
  healthconditionId: any;
  public imageUrl: any = '../../../../assets/img/no-image.png';
  pdfIcon: string = '../../../../../../assets/img/pdf_file_icon.png'
  videoIcon: string = '../../../../../../assets/img/video-play-icon.png'

  routeSubscribe: any;
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _http: HttpClient,
    public _toastr: Toastr,
    private router: Router,
    private _consultationHealthtConditions: ConsultationHealthConditionsService
  ) {
    this.routeSubscribe = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd){
        let activatedRoutes:any  = this.route;
        this.healthconditionId = activatedRoutes.parent.parent.snapshot.paramMap.get('condition_id');
        this.findByIdHealthConditions(this.healthconditionId);
      }
    });
  }

  ngOnInit(){

  }

  updateSequence (event: any) {
    let dataToSend: any = []

    if (event.mode == 'IMAGES' || event.mode == 'FAQS' || event.mode == 'ATTRIBUTES' || event.mode == 'DOCUMENTS' || event.mode == 'VIDEOS') {
      event.data.forEach((obj: any) => {
        dataToSend.push({ ...obj.item, sequence:obj.sequence });
      });
    } else {
      event.data.forEach((obj: any) => {
        dataToSend.push({ question_id: obj.item.question_id._id, sequence: obj.sequence, _id: obj.item._id });
      });
    }
    let url: string = `api/consultation_health_conditions/update_sequence/${this.healthconditionId}`;
    this._http.post(url, { mode: event.mode, sequences: dataToSend }).subscribe(data => {
        this._toastr.showSuccess('Sequence Updated Successfully');
      }, err => {
        this._toastr.showError('Unable to update sequence. Please try again');
      });
  }

  ngOnDestroy(){
    if (this.routeSubscribe) {
      this.routeSubscribe.unsubscribe();
    }
  }

  async findByIdHealthConditions(id: any) {
    let obj: any = await this._consultationHealthtConditions.findByIdHealthConditions(id);
    if (obj && obj._id) {
      this.healthCondition = obj;
      this._changeDetectorRef.detectChanges();
    }
  }

}
