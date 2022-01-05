import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { consultationHelper } from 'src/app/services/consultationHelper.service';
import { ProcessRefundModalComponent } from '../../../../components/process-refund-modal/process-refund-modal.component';
import { ProcessRefundModalService } from '../../../../components/process-refund-modal/process-refund-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-refund-requested',
  templateUrl: './refund-requested.component.html',
  styleUrls: ['./refund-requested.component.scss']
})
export class RefundRequestedComponent implements OnInit{


  modalRef!:BsModalRef;
  drug_orders_config:any;
	drug_orders_collection:any = { count: 0, data: [] };
  drug_order_hasMorePages:boolean=false;

  drug_orders_limit:number=10;
  drug_orders_limit_options=[5,10,20,30,50];

  drug_orders_sort_by:string='order_refund_requested_on';
  drug_orders_sort_order:any=-1;
  drug_orders_search:string='';

  drug_orders_sort_selected_option=7;
  drug_orders_sort_options=[
    {
      id:3,
      sort_by:'order_number',
      sort_order:-1,
      title:'Sort By Order No descending'
    },
    {
      id:4,
      sort_by:'order_number',
      sort_order:1,
      title:'Sort By Order No ascending'
    },
    {
      id:5,
      sort_by:'total_amount',
      sort_order:-1,
      title:'Sort By Total descending'
    },
    {
      id:6,
      sort_by:'total_amount',
      sort_order:1,
      title:'Sort By Total ascending'
    },
    {
      id:7,
      sort_by:'order_place_datetime',
      sort_order:-1,
      title:'Sort By OrderDate descending'
    },
    {
      id:8,
      sort_by:'order_place_datetime',
      sort_order:1,
      title:'Sort By OrderDate ascending'
    },
    {
      id:9,
      sort_by:'order_refund_requested_on',
      sort_order:-1,
      title:'Sort By Last Refund Requested Date descending'
    },
    {
      id:10,
      sort_by:'order_refund_requested_on',
      sort_order:1,
      title:'Sort By  Last Refund Requested Date ascending'
    }
  ];

  constructor(
    private _route: ActivatedRoute,
    private router:Router,
    private http: HttpClient,
    public _consultationHelper:consultationHelper,
    private _modalService:BsModalService,
    private _processRefundModalService:ProcessRefundModalService,
    private _changeDetectorRef: ChangeDetectorRef){

    this.drug_orders_config = {
			itemsPerPage:this.drug_orders_limit,
			currentPage: 1,
			totalItems: this.drug_orders_collection.count
    };

  }

  ngOnInit(){
    this.getRefundRequestedOrders(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search);
  }


  async calculateRefundForOrder(order_id:any,refundType:any){
    let order:any = this.drug_orders_collection.data.find((order:any)=>order._id==order_id);

    let paymentgateway_charge_refunded= null;
    if(order.charged_from_paymentgateway>0){
      let chargeDetails:any = await this._getPaymentDetailsForOrder(order._id);
      order.charge_details = chargeDetails &&  chargeDetails.id ?chargeDetails.id :null;
      paymentgateway_charge_refunded = order.charge_details && order.charge_details.status=='refunded'? true : false;
    }else{
      order.charge_details=null;
      paymentgateway_charge_refunded=null;
    }

    let amount_to_precess_refund_total=0;
    let amount_to_process_refund_in_paymentgateway=0;
    let amount_to_process_refund_in_wallet=0;
    let amount_to_process_refund_in_discount=0;
    let amount_to_process_refund_in_shipping_charge= order.shipping_charge  ?  order.shipping_charge : 0;
    let amount_to_process_refund_in_packing_charge = order.packing_charge ?  order.packing_charge : 0;
    let final_total = 0;

    let temp_total = order.subtotal_amount + amount_to_process_refund_in_shipping_charge + amount_to_process_refund_in_packing_charge;

    let pending_discount =(order.coupon_discount+order.referral_discount) - order.refunded_discount;

    if(temp_total>=pending_discount){
      amount_to_process_refund_in_discount=pending_discount;
      amount_to_precess_refund_total= temp_total - pending_discount;
      final_total= amount_to_precess_refund_total;
    }else{
      amount_to_process_refund_in_discount = temp_total;
      amount_to_precess_refund_total = 0;
      final_total= amount_to_precess_refund_total;
    }

    let total_balance_remaining   =    order.total_amount - order.refunded_total  ;
    let paymentgateway_balance_remaining  =   order.charged_from_paymentgateway  -  order.refunded_in_paymentgateway;
    let wallet_balance_remaining =    order.charged_from_wallet -  order.refunded_in_wallet;

    if(wallet_balance_remaining>0){
        amount_to_process_refund_in_wallet = amount_to_precess_refund_total>=wallet_balance_remaining ? wallet_balance_remaining : amount_to_precess_refund_total;
        final_total = final_total - amount_to_process_refund_in_wallet;
    }

    if(paymentgateway_balance_remaining>0){
        amount_to_process_refund_in_paymentgateway = final_total>=paymentgateway_balance_remaining ? paymentgateway_balance_remaining:final_total ;
        final_total= final_total - amount_to_process_refund_in_paymentgateway;
    }

    amount_to_precess_refund_total = Math.round(amount_to_precess_refund_total * 100) / 100 ;
    amount_to_process_refund_in_paymentgateway = Math.round(amount_to_process_refund_in_paymentgateway * 100) / 100 ;
    amount_to_process_refund_in_wallet = Math.round(amount_to_process_refund_in_wallet * 100) / 100 ;
    amount_to_process_refund_in_discount = Math.round(amount_to_process_refund_in_discount * 100) / 100 ;
    amount_to_process_refund_in_shipping_charge = Math.round(amount_to_process_refund_in_shipping_charge * 100) / 100 ;
    amount_to_process_refund_in_packing_charge = Math.round(amount_to_process_refund_in_packing_charge * 100) / 100 ;
    let refundObject={
      order_id:order._id,
      refund_kit:true,
      paymentgateway_charge_already_refunded:paymentgateway_charge_refunded,
      amount_to_precess_refund_total:amount_to_precess_refund_total,
      amount_to_process_refund_in_paymentgateway:amount_to_process_refund_in_paymentgateway,
      amount_to_process_refund_in_wallet:amount_to_process_refund_in_wallet,
      amount_to_process_refund_in_discount:amount_to_process_refund_in_discount,
      amount_to_process_refund_in_shipping_charge:amount_to_process_refund_in_shipping_charge,
      amount_to_process_refund_in_packing_charge:amount_to_process_refund_in_packing_charge
    }
    let defaultCalculatedRefundObject = JSON.parse(JSON.stringify(refundObject));

    this._processRefundModalService.setFormData({
      eventType:'ORDER',
      selectedOrder:order,
      refundObject:refundObject,
      defaultCalculatedRefundObject:defaultCalculatedRefundObject,
    });
    this.modalRef = this._modalService.show(ProcessRefundModalComponent,{class:'modal-x-lg'});
    this.modalRef.content.onRefundProcessedCompleted.subscribe(()=>{
      this.getRefundRequestedOrders(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search);
    });
  }


  handleChange(eventName:string,event:any){
    let value = event.target.value;
    if(eventName=='SORT'){
      let item:any= this.drug_orders_sort_options.find((obj:any)=>obj.id==value);
      this.drug_orders_sort_by=item.sort_by;
      this.drug_orders_sort_order=item.sort_order;
    }
    if(eventName=='LIMIT'){
      this.drug_orders_config.itemsPerPage=this.drug_orders_limit;
    }
    this.drug_orders_config.currentPage  =1;
    this.getRefundRequestedOrders(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search);
  }

  pageChanged(event:any){
    this.drug_orders_config.currentPage = event;
    this.getRefundRequestedOrders(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search);
  }

  getRefundRequestedOrders(page:number,limit:number,sortBy:string='id',sortOrder:string='DESC',search:string=''){
    this.http.get<any>(`api/consultations/list_refund_requested?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`).subscribe((resp) => {
        this.drug_orders_collection.data = resp.data;
        this.drug_orders_collection.count= resp.total;
        this.drug_orders_config.itemsPerPage =  resp.perPage;
        this.drug_orders_config.totalItems = resp.total;
        this.drug_orders_config.currentPage  =  resp.currentPage;
        this.drug_order_hasMorePages =  resp.hasMorePages;

    },err=>{
    });
  }

  goToOrderDetails(orderId:any){
    this.router.navigate(['admin', 'consultation', 'view', orderId]);
  }

  async _getPaymentDetailsForOrder(orderId:any){
    const url = `api/consultations/charge_details/${orderId}`;
    return await this.http.get(url).toPromise();
  }

}
