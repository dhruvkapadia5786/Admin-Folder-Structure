import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';
import Hashids from 'hashids';

@Injectable()
export class drugOrderHelper {

    getDefaultPriceForCustomQty(qtyPriceArray:any[],custom_qty:number){
        let price :number= 0;
        qtyPriceArray.sort(function (a, b) { return a.quantity - b.quantity; });

        if(qtyPriceArray.length>1){
            let index = qtyPriceArray.findIndex(qtyItem => qtyItem.quantity == custom_qty);
            if(index==-1){
                let mappedArray = qtyPriceArray.map((item:any)=>item.quantity);
                let findLowerQty = Math.min.apply(null,mappedArray);
                let findHigherQty =  Math.max.apply(null,mappedArray);

                let findLowerQtyIndex = qtyPriceArray.findIndex((pr:any)=> pr.quantity==findLowerQty);
                let findHigherQtyIndex = qtyPriceArray.findIndex((pr:any)=> pr.quantity==findHigherQty);
                let findHigherQtyPrice = qtyPriceArray[findHigherQtyIndex].price;
                let findLowerQtyPrice = qtyPriceArray[findLowerQtyIndex].price;

                if(custom_qty<=findLowerQty){ price = findLowerQtyPrice ;  return price;  }

                else if(custom_qty>findLowerQty &&  custom_qty<findHigherQty){

                    let findLowerArray=qtyPriceArray.filter((qp:any)=>qp.quantity<custom_qty);
                    let maxLower = findLowerArray[findLowerArray.length-1];
                    //console.log('MAX LOWER',maxLower);

                    let findHigherArray=qtyPriceArray.filter((qp:any)=>qp.quantity>custom_qty);
                    let minHigher = findHigherArray[0];
                //    console.log('MIN HIGHER',minHigher);


                    let lowerRate = maxLower.price / maxLower.quantity;
                   // console.log('LOWER RATE ==',lowerRate);
                    let higherRate = minHigher.price / minHigher.quantity;
                    //console.log('HIGHER RATE ==',higherRate);

                    let avgRate = (lowerRate + higherRate)/2;
                 //   console.log('AVG RATE ==',avgRate);

                    let newQty = custom_qty - maxLower.quantity;
                  //  console.log('NEW QTY RATE ==',newQty);

                    let minMaxPriceDiff= minHigher.price - maxLower.price;
                    let minMaxQtyDiff = minHigher.quantity - maxLower.quantity;
                    let minMaxRate = minMaxPriceDiff/minMaxQtyDiff;

                     price= maxLower.price + (minMaxRate * newQty);
                     price=parseFloat(price.toFixed(2));
                     return price;
                }
                else {

                    let rate = findHigherQtyPrice / findHigherQty;
                    price = rate* custom_qty;
                    price = parseFloat(price.toFixed(2));
                    return price;
                }

            }
            else{ price = qtyPriceArray[index].price;  return price; }
        }
        else{
            if(custom_qty<= qtyPriceArray[0].quantity){ price = qtyPriceArray[0].price;  return price;  }
            else{
                let rate = qtyPriceArray[0].price / qtyPriceArray[0].qty
                price = rate* custom_qty;
                return price;
            }
        }
    }

    getOrderDrugStatus(status: string) {
        let badge = '';
        if(status=='WAITING_FOR_PHARMACY_PROCESSING'){
          badge = `<span class='badge badge-pill badge-primary p-2'>WAITING FOR PROCESS ORDER</span>`;
        }
        else if (status == 'WAITING_FOR_RX_FROM_MAIL'){
          badge = `<span class='badge badge-pill badge-primary p-2'>WAITING FOR RX FROM MAIL</span>`;
        }
        else if (status == 'WAITING_FOR_RX_FROM_DOCTOR') {
          badge = `<span class='badge badge-pill badge-primary p-2'>WAITING FOR RX FROM DOCTOR</span>`;
        } else if (status == 'WAITING_FOR_RX_FROM_PHARMACY') {
          badge = `<span class='badge badge-pill badge-primary p-2'>WAITING FOR RX FROM PHARMACY</span>`;
        }
        else if (status == 'SHIPPED') {
          badge = `<span class='badge badge-pill badge-success p-2'>SHIPPED</span>`;
        }
        else if (status == 'PICKED_UP') {
          badge = `<span class='badge badge-pill badge-success p-2'>PICKED UP</span>`;
        }
        else if (status == 'REFUND_REQUESTED') {
          badge = `<span class='badge badge-pill badge-danger p-2'>REFUND REQUESTED</span>`;
        }
        else if (status == 'REFUND_PROCESSED') {
          badge = `<span class='badge badge-pill badge-danger p-2'>REFUND PROCESSED</span>`;
        }
        else if (status == 'COMPLETED') {
          badge = `<span class='badge badge-pill badge-success p-2'>COMPLETED</span>`;
        }
        else if (status == 'REJECTED') {
          badge = `<span class='badge badge-pill badge-danger p-2'>ORDER REJECTED</span>`;
        }
        else {
          badge = '<span></span>';
        }
        return badge;
      }

      getOrderDrugCustomerOption(status: string) {
        let badge = '';
        if (status == 'PRESCRIPTION_FROM_OTHER_PHARMACY') {
          badge = `<span class='badge badge-pill badge-info p-2'>TRANSFER FROM OTHER PHARMACY</span>`;
        }
        else if (status == 'PRESCRIPTION_FROM_DOCTOR') {
          badge = `<span class='badge  badge-pill badge-warning p-2'>PRESCRIPTION FROM DOCTOR</span>`;
        }
        else if (status == 'HAVE_PHYSICAL_PRESCRIPTION') {
          badge = `<span class='badge  badge-pill badge-success p-2'>PHYSICAL PRESCRIPTION</span>`;
        }
        else if(status=='MANUALLY_ENTER_PRESCRIPTION'){
          badge = `<span class='badge  badge-pill badge-success p-2'>MANUALLY ENTERRED PRESCRIPTION</span>`;
        }
        else {
          badge = '<span></span>';
        }
        return badge;
      }


      getTechnicianStatusDrugOrder(status:string) {
        let badge='';
        if (status == 'APPROVED') {
          badge= `<span class='badge badge-pill badge-success p-2'>Approved</span>`;
        }
        else if (status == 'REJECTED'){
          badge= `<span class='badge badge-pill badge-danger p-2'>Rejected</span>`;
        }
        else if (status == 'REFUNDED') {
          badge= `<span class='badge badge-pill badge-danger p-2'>Refunded</span>`;
        } else {
          badge= `<span class='badge badge-pill badge-info p-2'>Received</span>`;
        }
        return badge;
      }


    getCustomerStausDrugOrder(status:string) {
      let badge='';
      if (status == 'UNDER_REVIEW'){
        badge= `<span class='badge  badge-pill badge-info p-2'>Under Review</span>`;
      }
      else if (status == 'REJECTED'){
        badge= `<span class='badge  badge-pill badge-danger  p-2'>Rejected</span>`;
      } else if (status == 'SEND_TO_PHARMACY') {
        badge= `<span class='badge  badge-pill badge-primary  p-2'>Sent To Pharmacy</span>`;
      } else if (status == 'COMPLETED'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Completed</span>`;
      } else if (status == 'REFUNDED'){
        badge= `<span class='badge  badge-pill badge-danger  p-2'>Refunded</span>`;
      } else {
        badge= '<span></span>';
      }
      return badge;
    }

    getPharmacyStatusDrugOrder(status:string){
      let badge='';
      if (status == 'INCOMPLETE'){
        badge= `<span class='badge  badge-pill badge-info p-2'>Incomplete</span>`;
      }else if (status == 'COMPLETED'){
        badge= `<span class='badge  badge-pill badge-success  p-2'>Completed</span>`;
      } else if (status == 'REFUNDED'){
        badge= `<span class='badge  badge-pill badge-danger  p-2'>Refunded</span>`;
      } else {
        badge= '<span></span>';
      }
      return badge;
    }

    getSystemStausDrugOrder(status:string) {
      let badge='';
      if (status == 'ASSIGNED_TO_TECHNICIAN'){
        badge= `<span class='badge  badge-pill badge-info p-2'>Assigned To Technician</span>`;
      }
      else if (status == 'REJECTED'){
        badge= `<span class='badge  badge-pill badge-danger  p-2'>Rejected</span>`;
      } else if (status == 'ASSIGNED_TO_PHARMACY') {
        badge= `<span class='badge  badge-pill badge-primary  p-2'>Assigned To Pharmacy</span>`;
      } else if (status == 'COMPLETED'){
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

    getDrugOrderSubscriptionStatusMini(data:string){
      let subscriptionStatusBadge='';
      switch (data) {
        case 'active':
            subscriptionStatusBadge= `<span class='px-2 py-1 badge badge-pill badge-success'>Active</span>`;
        break;
        case 'completed':
            subscriptionStatusBadge= `<span class='px-2 py-1 badge badge-pill badge-primary'>Completed</span>`;
        break;
        case 'cancelled':
            subscriptionStatusBadge= `<span class='px-2 py-1 badge badge-pill badge-danger'>Cancelled</span>`;
        break;
        case 'refunded':
          subscriptionStatusBadge= `<span class='px-2 py-1 badge badge-pill badge-danger'>Refunded</span>`;
        break;
        case 'transferred':
          subscriptionStatusBadge= `<span class='px-2 py-1 badge badge-pill badge-warning'>Transferred</span>`;
        break;
        case 'account_disabled':
          subscriptionStatusBadge= `<span class='px-2 py-1 badge badge-pill badge-dark'>User Account Disabled</span>`;
        break;

        case 'closed':
        subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-dark'>Closed</span>`;
        break;

        case 'action_required':
        subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-warning'>Action Required</span>`;
        break;

        case 'drug_not_available':
        subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-dark'>Drug Not Available</span>`;
        break;

          default:
          subscriptionStatusBadge= ``;
        break;
      }
      return subscriptionStatusBadge;
    }

    getDrugOrderSubscriptionStatus(data:string){
      let subscriptionStatusBadge='';
      switch (data) {
        case 'active':
            subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-success'>Active</span>`;
        break;
        case 'completed':
            subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-primary'>Completed</span>`;
        break;
        case 'cancelled':
            subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-danger'>Cancelled</span>`;
        break;
        case 'refunded':
          subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-danger'>Refunded</span>`;
        break;
        case 'transferred':
          subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-warning'>Transferred</span>`;
        break;
        case 'account_disabled':
          subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-dark'>User Account Disabled</span>`;
        break;

        case 'closed':
        subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-dark'>Closed</span>`;
        break;

        case 'action_required':
        subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-warning'>Action Required</span>`;
        break;

        case 'drug_not_available':
        subscriptionStatusBadge= `<span class='p-2 badge badge-pill badge-dark'>Drug Not Available</span>`;
        break;

          default:
          subscriptionStatusBadge= ``;
        break;
      }
      return subscriptionStatusBadge;
    }

}
