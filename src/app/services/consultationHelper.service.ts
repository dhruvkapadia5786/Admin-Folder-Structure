import { Injectable } from "@angular/core";

@Injectable()
export class consultationHelper {

  getSystemStatus(status:string) {
    let badge='';
    if (status == null){
      badge= `<span class='badge  badge-pill badge-warning p-2'>Incomplete</span>`;
    }else if (status == 'ASSIGNED_TO_TECHNICIAN'){
      badge= `<span class='badge  badge-pill badge-info p-2'>Assigned To Technician</span>`;
    }
    else if (status == 'APPROVED_BY_TECHNICIAN'){
      badge= `<span class='badge  badge-pill badge-primary p-2'>Approved By Technician</span>`;
    }
    else if (status == 'ASSIGNED_TO_DOCTOR'){
        badge= `<span class='badge  badge-pill badge-info p-2'>Assigned To Doctor</span>`;
    }
    else if (status == 'PRESCRIBED_BY_DOCTOR'){
        badge= `<span class='badge  badge-pill badge-primary p-2'>Prescribed By Doctor</span>`;
    }
    else if (status == 'REJECTED'){
      badge= `<span class='badge  badge-pill badge-danger  p-2'>Rejected</span>`;
    } else if (status == 'ASSIGNED_TO_PHARMACY') {
      badge= `<span class='badge  badge-pill badge-primary  p-2'>Assigned To Pharmacy</span>`;
    }
    else if (status == 'COMPLETED'){
      badge= `<span class='badge  badge-pill badge-success  p-2'>Completed</span>`;
    } else if (status == 'REFUND_REQUESTED'){
      badge= `<span class='badge  badge-pill badge-danger  p-2'>Refund Requested</span>`;
    }
    else if (status == 'REFUND_PROCESSED'){
      badge= `<span class='badge  badge-pill badge-danger  p-2'>Refund Processed</span>`;
    } else {
      badge= '<span></span>';
    }
    return badge;
  }

  getTechnicianStatus(status:string) {
      let badge='';
      if (status == 'APPROVED') {
        badge= `<span class='badge badge-pill badge-success p-2'>Approved</span>`;
      }
      else if (status == 'REJECTED'){
        badge= `<span class='badge badge-pill badge-danger p-2'>Rejected</span>`;
      }
      else if (status == 'RECEIVED_TOO_SOON'){
        badge= `<span class='badge badge-pill badge-warning p-2'>Too Soon</span>`;
      }
      else if (status=='CONSENT_SENT'){
        badge= `<span class='badge badge-pill badge-warning p-2'>Consent Sent</span>`;
      }
      else if (status=='ACTION_NEEDED'){
        badge= `<span class='badge badge-pill badge-dark p-2'>Action Required</span>`;
      }
      else if (status == 'REFUNDED') {
        badge= `<span class='badge badge-pill badge-danger p-2'>Refunded</span>`;
      } else {
        badge= `<span class='badge badge-pill badge-info p-2'>Received</span>`;
      }
      return badge;
  }

  getCustomerStatus(status:string) {
      let badge='';
      if (status == null || status == 'INCOMPLETE'){
        badge= `<span class='badge  badge-pill badge-warning p-2'>Incomplete</span>`;
      }else if (status == 'UNDER_REVIEW'){
        badge= `<span class='badge  badge-pill badge-info p-2'>Under Review</span>`;
      }
      else if (status == 'REJECTED'){
        badge= `<span class='badge  badge-pill badge-danger  p-2'>Rejected</span>`;
      }
      else if(status=='PRESCRIBED_BY_DOCTOR'){
          badge= `<span class='badge  badge-pill badge-info p-2'>Prescribed By Doctor</span>`;
      }
      else if (status == 'SEND_TO_PHARMACY'){
        badge= `<span class='badge  badge-pill badge-primary  p-2'>Sent To Pharmacy</span>`;
      }
      else if (status == 'SHIPPED'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Shipped</span>`;
      }
      else if (status=='ACTION_NEEDED'){
        badge= `<span class='badge badge-pill badge-dark p-2'>Action Required</span>`;
      }
      else if (status == 'PICKEDUP_DELIVERY'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Pickedup / Delivery</span>`;
      }
      else if (status == 'COMPLETED'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Completed</span>`;
      } else if (status == 'REFUNDED'){
        badge= `<span class='badge  badge-pill badge-danger  p-2'>Refunded</span>`;
      } else {
        badge= '<span></span>';
      }
      return badge;
  }

  getDoctorStatus(status:string){
    let badge='';
    if (status == 'RECEIVED'){
      badge= `<span class='badge badge-pill badge-info p-2'>Received</span>`;
    }
    else if(status=='PRESCRIBED'){
      badge= `<span class='badge badge-pill badge-success p-2'>Prescribed</span>`;
    }
    else if (status == 'REFUNDED') {
      badge= `<span class='badge badge-pill badge-danger p-2'>Refunded</span>`;
    }
    else if (status=='CONSENT_SENT'){
      badge= `<span class='badge badge-pill badge-warning p-2'>Consent Sent</span>`;
    }
    else if (status=='ACTION_NEEDED'){
      badge= `<span class='badge badge-pill badge-dark p-2'>Action Required</span>`;
    }
    else{
      badge= '<span></span>';
    }
    return badge;
  }

}
