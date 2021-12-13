import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-login-history-devices',
  templateUrl: './login-history-devices.component.html',
  styleUrls: ['./login-history-devices.component.scss']
})
export class LoginHistoryDevicesComponent implements OnInit {
  public customerId: any;
  deviceList:any[]=[];
  loginHistory:any[]=[];

  constructor(public http: HttpClient,private route: ActivatedRoute){

  }

  ngOnInit() {
    let activeRoute:any = this.route;
    activeRoute.parent.parent.params.subscribe((params:any) => {
      this.customerId = params['id'];
      this.getCustomerDevices();
      this.getCustomerLoginHistory();
    });

  }

  getFormatedDate(date: any) {
		return date ? moment(date,'YYYY-MM-DDTHH:mm:ss.Z').format('MM/DD/YYYY HH:mm A') : 'Not Available';
	}

  getCustomerDevices() {
    const url = 'api/users/device/' + this.customerId;
    this.http.get(url).subscribe((devices: any) => {
      this.deviceList = devices
    }, (error: any) => {

    })
  }

  getCustomerLoginHistory(){
    const url = 'api/users/login_history/' + this.customerId;
    this.http.get(url).subscribe((history: any) => {
      this.loginHistory = history
    }, (error: any) => {

    })
  }

}
