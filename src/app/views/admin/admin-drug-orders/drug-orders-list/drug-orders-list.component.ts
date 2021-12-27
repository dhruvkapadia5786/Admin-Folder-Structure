import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import {drugOrderHelper} from 'src/app/services/drugOrderHelper.service';

@Component({
  selector: 'app-drug-orders-list',
  templateUrl: './drug-orders-list.component.html',
  styleUrls: ['./drug-orders-list.component.scss']
})
export class DrugOrdersListComponent implements OnInit {


  drug_orders_config:any;
	drug_orders_collection:any = { count: 0, data: [] };
  drug_order_hasMorePages:boolean=false;

  drug_orders_limit:number=10;
  drug_orders_limit_options=[5,10,20,30,50];

  drug_orders_status='ALL';
  drug_orders_status_options=['ALL','ASSIGNED_TO_TECHNICIAN','ASSIGNED_TO_PHARMACY','COMPLETED','REFUND_REQUESTED','REFUND_PROCESSED','REJECTED'];

  drug_orders_sort_by:string='created_at';
  drug_orders_sort_order:any=-1;
  drug_orders_search:string='';

  drug_orders_sort_selected_option=1;
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
      sort_by:'order_created_datetime',
      sort_order:-1,
      title:'Sort By OrderDate descending'
    },
    {
      id:8,
      sort_by:'order_created_datetime',
      sort_order:1,
      title:'Sort By OrderDate ascending'
    },
    {
      id:9,
      sort_by:'order_completed_datetime',
      sort_order:-1,
      title:'Sort By OrderCompleted Date descending'
    },
    {
      id:10,
      sort_by:'order_completed_datetime',
      sort_order:1,
      title:'Sort By  OrderCompleted Date ascending'
    }
  ]

  constructor(private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    public _drugOrderHelper:drugOrderHelper,
    private _changeDetectorRef: ChangeDetectorRef) {


    this.drug_orders_config = {
			itemsPerPage:this.drug_orders_limit,
			currentPage: 1,
			totalItems: this.drug_orders_collection.count
    };

  }

  ngOnInit(){
    this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search,this.drug_orders_status);
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
   this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search,this.drug_orders_status);
 }

 pageChanged(event:any){
   this.drug_orders_config.currentPage = event;
   this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,this.drug_orders_sort_by,this.drug_orders_sort_order,this.drug_orders_search,this.drug_orders_status);
 }

  getDrugOrderData(page:number=1,limit:number=10,sortBy:string='created_at',sortOrder:any=-1,search:string='',status:string){
    this._http.get<any>(`api/pharmacy_orders/list?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&status=${status}`).subscribe((resp) => {
        this.drug_orders_collection.data = resp.data;
        this.drug_orders_collection.count= resp.total;
        this.drug_orders_config.itemsPerPage =  resp.perPage;
        this.drug_orders_config.totalItems = resp.total;
        this.drug_orders_config.currentPage  =  resp.currentPage;
        this.drug_order_hasMorePages = resp.hasMorePages;
        window.scrollTo({
          top: 0,
            behavior: 'smooth'
        })
    },err=>{

    });
  }

  goToDetailsPage(orderId: any): any {
    this.router.navigate(['admin', 'drug-order', 'view', orderId]);
  }

  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }

}
