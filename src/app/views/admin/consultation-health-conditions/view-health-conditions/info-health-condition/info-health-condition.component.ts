import { Component, OnInit, ChangeDetectorRef ,ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { ConsultationHealthConditionsService } from '../../consultation-health-conditions.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-info-health-condition',
  templateUrl: './info-health-condition.component.html',
  styleUrls: ['./info-health-condition.component.scss']
})
export class InfoHealthConditionComponent implements OnInit, OnDestroy {
  healthCondition: any;
  healthconditionId: any;
  public imageUrl: any = '../../../../assets/img/no-image.png';

  routeSubscribe: any;
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _http: HttpClient,
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
