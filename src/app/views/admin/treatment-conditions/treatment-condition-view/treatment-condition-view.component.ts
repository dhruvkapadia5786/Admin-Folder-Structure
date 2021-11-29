import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-treatment-condition-view',
  templateUrl: './treatment-condition-view.component.html',
  styleUrls: ['./treatment-condition-view.component.scss']
})
export class TreatmentConditionViewComponent implements OnInit {
  selectedConditionId: any;
  public conditions: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef){
    let activatedRoute :any =  this.route;
    if(activatedRoute){
      this.selectedConditionId = activatedRoute.parent.snapshot.paramMap.get('treatment_condition_id');
    }
  }

  ngOnInit(){
    this.getAllTreatmentConditionList();
  }

  public getAllTreatmentConditionList(){
    const url = 'api/treatment_conditions/all';
    this.http.get(url).subscribe((conditionsList: any) => {
        this.conditions = conditionsList;
        this._changeDetectorRef.detectChanges();
      },(err:any) => {

      });
  }

  public onTreatmentChange(conditionId: any){
    this.router.navigate(['admin','treatment-conditions','view',conditionId,'info'])
  }
}
