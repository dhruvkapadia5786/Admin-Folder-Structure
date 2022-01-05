import { Injectable } from '@angular/core';
@Injectable()
export class orderHelper {

  getSubscriptionStatus(data:string){
		let subscriptionStatusBadge='';
		switch (data) {
		  case 'active':
			  subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill  badge-success'>Active</span>`;
		  break;
		  case 'completed':
			  subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill  badge-primary'>Completed</span>`;
		  break;
		  case 'cancelled':
			  subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill  badge-danger'>Cancelled</span>`;
		  break;
		  case 'refunded':
			subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill badge-danger'>Refunded</span>`;
		  break;
		  case 'transferred':
			subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill badge-warning'>Transferred</span>`;
		  break;
		  case 'account_disabled':
			subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill badge-dark'>User Account Disabled</span>`;
		  break;
			case 'closed':
			subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill badge-dark'>Closed</span>`;
			break;
			case 'prescription_expired':
			subscriptionStatusBadge= `<span class='py-1 px-2 badge badge-pill badge-dark'>Prescription Expired</span>`;
			break;
			default:
			subscriptionStatusBadge= ``;
		  break;
		}
		return subscriptionStatusBadge;
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
      }else{
        badge= '<span></span>';
      }
      return badge;
    }

    getPharmacyStatus(status:string){
      let badge='';
      if (status == 'INCOMPLETE'){
        badge= `<span class='badge  badge-pill badge-info p-2'>Incomplete</span>`;
      }
      else if (status == 'SHIPPED'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Shipped</span>`;
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
      else if (status == 'TOO_SOON'){
        badge= `<span class='badge  badge-pill badge-warning p-2'>Too Soon</span>`;
      }
      else if (status == 'ASSIGNED_TO_DOCTOR'){
          badge= `<span class='badge  badge-pill badge-info p-2'>Assigned To Doctor</span>`;
      }
      else if (status == 'PRESCRIBED_BY_DOCTOR'){
          badge= `<span class='badge  badge-pill badge-primary p-2'>Prescribed By Doctor</span>`;
      }
      else if (status == 'CONSULTATION_REQUIRED'){
          badge= `<span class='badge  badge-pill badge-info p-2'>Consultation Required</span>`;
      }
      else if (status == 'REJECTED'){
        badge= `<span class='badge  badge-pill badge-danger  p-2'>Rejected</span>`;
      } else if (status == 'ASSIGNED_TO_PHARMACY') {
        badge= `<span class='badge  badge-pill badge-primary  p-2'>Assigned To Pharmacy</span>`;
      }
      else if (status == 'SHIPPED'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Shipped</span>`;
      }
      else if (status == 'PICKEDUP_DELIVERY'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Pickedup / Delivery</span>`;
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

    getOrderType(data:any){
      let badge='';
      switch (data) {
        case null:
        badge= `<span class='badge badge-warning'>Default</span>`;
        break;
        case 'MAIN':
        badge= `<span class='badge badge-danger'>Main</span>`;
        break;
        case 'REFILL':
        badge= `<span class='badge badge-primary'>Refill</span>`;
        break;
        default:
        badge= '';
        break;
      }
    return badge;
    }

    getOrderCreatedWay(data:any){
    let badge='';
    switch (data) {
      case 'MANUAL_BY_USER':
      badge= `<span class='badge badge-info'>Manually By Customer</span>`;
      break;
      case 'MANUAL_BY_STAFF':
      badge= `<span class='badge badge-warning'>Manually By Staff</span>`;
      break;
      case 'AUTO_BY_SYSTEM':
      badge= `<span class='badge badge-dark'>Auto By System</span>`;
      break;
    }
    return badge;
    }

    getSubscriptionText(days:number){
      if(days){
         if(days==1){
         return 'Every Day';
         }
         else if(days<=7 && days>=10){
         return 'Every Week';
         }
         else if(days<=15 && days>10){
         return 'Biweekly';
         }
         else if(days<=31 && days>=16){
         return 'Every Month';
         }
         else if(days<=60 && days>=50){
         return 'Every Two Month';
         }
         else if(days<=90 && days>=61){
         return 'Every Three Month';
         }
         else if(days<=120 && days>=91){
         return 'Every Four Month';
         }
         else{
         return `Every ${days} Days`
         }
      }else{
        return '';
      }
    }


	getOrderDrugStatus(status: string, user_role: string) {
		let badge = '';
		if (status == 'ORDER_PLACED') {
			badge = `<span class='badge badge-pill badge-info p-2'>ORDER PLACED</span>`;
		}
		else if (status == 'UNDER_REVIEW') {
			badge = `<span class='badge badge-pill badge-info p-2'>UNDER REVIEW</span>`;
		}
		else if (status == 'PRESCRIBED') {
			badge = `<span class='badge badge-pill badge-primary p-2'>PRESCRIBED BY DOCTOR</span>`;
		}
		else if (status == 'SHIPPED') {
			badge = `<span class='badge badge-pill badge-success p-2'>SHIPPED</span>`;
		}
		else if (status == 'PICKED_UP') {
			badge = `<span class='badge badge-pill badge-success p-2'>PICKED UP</span>`;
		}
		else if (status == 'REFUND_REQUESTED') {
			badge = user_role == 'user'? `<span class='badge badge-pill badge-dark p-2'>REFUNDED</span>` : `<span class='badge badge-pill badge-danger p-2'>REFUND REQUESTED</span>`;
		}
		else if (status == 'REFUND_PROCESSED') {
			badge = user_role == 'user' ? `<span class='badge badge-pill badge-danger p-2'>REFUNDED</span>` : `<span class='badge badge-pill badge-danger p-2'>REFUND PROCESSED</span>`;
		}
		else if (status == 'COMPLETED') {
			badge = `<span class='badge badge-pill badge-success p-2'>COMPLETED</span>`;
		}
		else if (status == 'REJECTED') {
			badge = `<span class='badge badge-pill badge-danger p-2'>ORDER REJECTED</span>`;
		}
		else if (status == 'WAITING_FOR_PHARMACY_PROCESSING') {
			badge = `<span class='badge badge-pill badge-primary p-2'>WAITING FOR PHARMACY PROCESSING</span>`;
		}
		else {
			badge = '<span></span>';
		}
		return badge;
	}


}
