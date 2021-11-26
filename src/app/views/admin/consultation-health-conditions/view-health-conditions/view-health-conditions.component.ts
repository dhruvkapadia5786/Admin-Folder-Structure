import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-health-conditions',
  templateUrl: './view-health-conditions.component.html'
})

export class ViewHealthConditionsComponent implements OnInit {
  selectedConditionId: any;
  public conditions: any[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    let activatedRoute :any =  this.route;
    if(activatedRoute){
      this.selectedConditionId = activatedRoute.parent.snapshot.paramMap.get('condition_id');
    }
  }

  ngOnInit(){
    this.getAllHealthConditionList();
  }

  public getAllHealthConditionList(){
    const url = 'api/consultation_health_conditions/all';
    this.http.get(url).subscribe((conditionsList: any) => {
        this.conditions = conditionsList;
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

  public onHealthConditionChange(conditionId: any){
    this.router.navigate(['admin/health-conditions/view/condition',conditionId,'info'])
  }
}
