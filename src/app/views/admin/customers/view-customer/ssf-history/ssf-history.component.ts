import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ssf-history',
  templateUrl: './ssf-history.component.html',
  styleUrls: ['./ssf-history.component.scss']
})
export class SsfHistoryComponent implements OnInit {
  public customerId: any;
  public familyHistory: any;
  public surgicalHistory: any;
  public socialHistory: any;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute) { }

  ngOnInit(){
    let activeRoute:any=this.route;
    activeRoute.parent.parent.params.subscribe((params:any) => {
      this.customerId = params['id'];
      this.getLatestFamilyHistory();
    })
  }

  getLatestFamilyHistory(){
    const url = 'api/customers/view/' + this.customerId;
    this.http.get(url).subscribe((data: any) => {
          this.familyHistory = data.family_history ? data.family_history:[];
          this.socialHistory = data.social_history ? data.social_history :[];
          this.surgicalHistory = data.surgical_history?data.surgical_history:[];
      },
      (err) => {

      });
  }

}
