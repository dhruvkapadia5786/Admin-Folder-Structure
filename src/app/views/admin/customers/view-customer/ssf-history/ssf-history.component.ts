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
    let activeRoute:any;
    activeRoute.parent.parent.params.subscribe((params:any) => {
      this.customerId = params['id'];
      this.getLatestFamilyHistory();
      this.getLatestSurgicalHistory();
      this.getLatestSocialHistory();
    })
  }

  getLatestFamilyHistory() {
    const url = `api/v1/customer/latest_family_history?show_default_json=1&customerId=${this.customerId}`;
    this.http.get(url).subscribe((data: any) => {
        if (data)
          this.familyHistory = data.details;
      },
      (err) => {
        console.log(err)
      }
    );
  }
  getLatestSocialHistory() {
    const url = `api/v1/customer/latest_social_history?show_default_json=1&customerId=${this.customerId}`;
    this.http.get(url).subscribe((data: any) => {
        if(data)
          this.socialHistory = data.details;
      },
      (err) => {
        console.log(err)
      }
    );
  }
  getLatestSurgicalHistory() {
    const url = `api/v1/customer/latest_surgical_history?show_default_json=1&customerId=${this.customerId}`;
    this.http.get(url).subscribe((data: any) => {
        if(data)
          this.surgicalHistory = data.details;
      },
      (err) => {
        console.log(err)
      }
    );
  }

}
