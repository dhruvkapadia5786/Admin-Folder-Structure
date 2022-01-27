import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject,Observable } from "rxjs";

@Injectable({providedIn:"root"})
export class notificationHelper {

    constructor(private _http: HttpClient) {}

  	public smsCountChange: BehaviorSubject<number> = new BehaviorSubject<number>(0);


    getNotificationIcon(notification_event:string){
		if(notification_event=='ORDER_CONSENT_REQUIRED' || notification_event=='ORDER_FREEFORM_CONSENT_REQUIRED' || notification_event=='CONSULTATION_FREEFORM_CONSENT_REQUIRED' || notification_event=='ORDER_PAYMENT_AUTHORIZATION_REQUIRED'){
		  return 'mr-3 fas fa-2x fa-exclamation-circle text-danger';
		}else if(notification_event=='ORDER_COMMENT' || notification_event=='DRUG_ORDER_COMMENT' || notification_event=='CONSULTATION_COMMENT'){
		  return 'mr-3 fas fa-2x fa-comment text-primary';
		}
		else if(notification_event=='ORDER_APPROVED'){
		  return 'mr-3 fas fa-2x fa-check-circle text-success';
		}
		else if(notification_event=='ORDER_PRESCRIBED'){
		  return 'mr-3 fas fa-2x fa-pencil-square text-primary';
		}
		else if(notification_event=='ORDER_SHIPPED' || notification_event=='DRUG_ORDER_SHIPPED'){
		  return 'mr-3 fas fa-2x fa-truck text-success';
		}
		else if(notification_event=='ORDER_CONSULTATION_SCHEDULE' || notification_event=='CONSULTATION_SCHEDULED'){
		  return 'mr-3 fas fa-2x fa-clock text-info';
		}
		else if(notification_event=='ORDER_CONSULTATION_REQUIRED'){
		  return 'mr-3 fas fa-2x fa-stethoscope text-dark';
		}
		else if(notification_event=='ORDER_CONSULTATION_SCHEDULE_APPROVED'){
		  return 'mr-3 fas fa-2x fa-check-circle text-success';
		}
		else if(notification_event=='ORDER_CONSULTATION_SCHEDULE_REJECTED'){
		  return 'mr-3 fas fa-2x fa-ban text-danger';
		}else if(notification_event=='ORDER_CONSENT_GIVEN' || notification_event=='ORDER_FREEFORM_CONSENT_GIVEN' || notification_event=='CONSULTATION_FREEFORM_CONSENT_GIVEN'){
			return 'mr-3 fas fa-2x fa-check-square text-success';
		}else if(notification_event=='ORDER_REFUNDED' || notification_event=='DRUG_ORDER_REFUNDED'){
			return 'mr-3 fas fa-2x fa-usd text-success';
	    }else if(notification_event=='REFERRAL_REWARD'){
			return 'mr-3 fas fa-2x fa-trophy text-warning';
		}
		else if(notification_event=='CONSULTATION_MEDICINE_PRESCRIBED'){
			return 'mr-3 fas fa-2x fa-medkit text-primary';
		}else{
      return 'mr-3 fas fa-2x fa-exclamation-circle text-info'
    }
	}

  clickNotification(loggedInUser:any,notification:any,_router:any){
    if(notification.read_at==null){
        this.readNotification([notification._id]);
    }

  }

  async readNotification(notificationIds:number[]) {
      return await this._http.post(`api/v1/notifications/markAsRead`,{ids:notificationIds}).toPromise();
  }

  async readAllNotification(){
      return await this._http.post(`api/v1/notifications/markAllAsRead`,{}).toPromise();
  }


}
