import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {drugOrderHelper} from 'src/app/services/drugOrderHelper.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-refund-processed-drug-orders',
  templateUrl: './refund-processed-drug-orders.component.html',
  styleUrls: ['./refund-processed-drug-orders.component.scss']
})
export class RefundProcessedDrugOrdersComponent implements OnInit {

  drug_orders_config:any;
	drug_orders_collection:any = { count: 0, data: [] };
  drug_order_hasMorePages:boolean=false;

  drug_orders_limit:number=10;
  drug_orders_limit_options=[5,10,20,30,50];

  drug_orders_sort_by:string='last_refund_processed_on';
  drug_orders_sort_order:string='DESC';
  drug_orders_search:string='';

  drug_orders_sort_selected_option=7;
  drug_orders_sort_options=[
    {
      id:1,
      sort_by:'id',
      sort_order:'DESC',
      title:'Sort By ID descending'
    },
    {
      id:2,
      sort_by:'id',
      sort_order:'ASC',
      title:'Sort By ID ascending'
    },
    {
      id:3,
      sort_by:'order_number',
      sort_order:'DESC',
      title:'Sort By Order No descending'
    },
    {
      id:4,
      sort_by:'order_number',
      sort_order:'ASC',
      title:'Sort By Order No ascending'
    },
    {
      id:5,
      sort_by:'total_amount',
      sort_order:'DESC',
      title:'Sort By Total descending'
    },
    {
      id:6,
      sort_by:'total_amount',
      sort_order:'ASC',
      title:'Sort By Total ascending'
    },
    {
      id:7,
      sort_by:'order_created_datetime',
      sort_order:'DESC',
      title:'Sort By OrderDate descending'
    },
    {
      id:8,
      sort_by:'order_created_datetime',
      sort_order:'ASC',
      title:'Sort By OrderDate ascending'
    },
    {
      id:9,
      sort_by:'last_refund_processed_on',
      sort_order:'DESC',
      title:'Sort By Last Refund Processed Date descending'
    },
    {
      id:10,
      sort_by:'last_refund_processed_on',
      sort_order:'ASC',
      title:'Sort By  Last Refund Processed Date ascending'
    }
  ]

  constructor(
    private _route: ActivatedRoute,
    private router:Router,
    private http: HttpClient,
    public _drugOrderHelper:drugOrderHelper,
    private _changeDetectorRef: ChangeDetectorRef){


    this.drug_orders_config = {
			itemsPerPage:this.drug_orders_limit,
			currentPage: 1,
			totalItems: this.drug_orders_collection.count
    };

  }

  ngOnInit(){
     this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search);
  }


  handleChange(eventName:string,event:any){
    let value = event.target.value;

    if(eventName=='SORT'){
      let item:any = this.drug_orders_sort_options.find((obj:any)=>obj.id==value);
      this.drug_orders_sort_by=item.sort_by;
      this.drug_orders_sort_order=item.sort_order;
    }
    if(eventName=='LIMIT'){
      this.drug_orders_config.itemsPerPage=this.drug_orders_limit;
      this.drug_orders_config.currentPage  =1;
    }
    this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search);
  }

  pageChanged(event:any){
		this.drug_orders_config.currentPage = event;
		this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search);
  }

  getDrugOrderData(page:number,limit:number,sortBy:string='id',sortOrder:string='DESC',search:string=''){
		this.http.get<any>(`api/drug_orders/refund_processed?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`).subscribe((resp) => {
				this.drug_orders_collection.data = resp.data;
				this.drug_orders_collection.count= resp.total;
				this.drug_orders_config.itemsPerPage =  resp.perPage;
				this.drug_orders_config.totalItems = resp.total;
				this.drug_orders_config.currentPage  =  resp.currentPage;
				window.scrollTo({
					top: 0,
  					behavior: 'smooth'
				})
		},err=>{
		});
  }

  goToDrugOrderDetails(orderId:number){
    this.router.navigate(['admin', 'drug-order','view',orderId]);
  }

}
