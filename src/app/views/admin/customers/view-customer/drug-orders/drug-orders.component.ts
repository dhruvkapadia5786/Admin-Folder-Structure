import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {drugOrderHelper} from 'src/app/services/drugOrderHelper.service';

@Component({
  selector: 'app-drug-orders',
  templateUrl: './drug-orders.component.html',
  styleUrls: ['./drug-orders.component.scss']
})
export class DrugOrdersComponent implements OnInit {
  parentSub: any;
  patientId: any;
  orderHistory: any;

  drug_orders_config:any;
	drug_orders_collection:any = { count: 0, data: [] };
  drug_order_hasMorePages:boolean=false;

  constructor(
    private _route: ActivatedRoute,
    private router:Router,
    private http: HttpClient,
    public _drugOrderHelper:drugOrderHelper,
    private _changeDetectorRef: ChangeDetectorRef){

    let activeRoute:any=this._route;
    this.parentSub = activeRoute.parent.parent.params.subscribe((params:any) => {
      this.patientId = params['id'];
    });

    this.drug_orders_config = {
			itemsPerPage:20,
			currentPage: 1,
			totalItems: this.drug_orders_collection.count
    };

  }

  ngOnInit(){
     this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,'id','DESC');
  }


	pageChanged(event:any){
		this.drug_orders_config.currentPage = event;
		this.getDrugOrderData(this.drug_orders_config.currentPage,this.drug_orders_config.itemsPerPage,'id','DESC');
  }

  getDrugOrderData(page:number,limit:number,sortBy:string='id',sortOrder:string='DESC'){
		this.http.get<any>(`api/pharmacy_orders/history/${this.patientId}?page=${page}&limit=${limit}`).subscribe((resp) => {
				this.drug_orders_collection.data = resp.data;
				this.drug_orders_collection.count= resp.total;
				this.drug_orders_config.itemsPerPage =  resp.perPage;
				this.drug_orders_config.totalItems = resp.total;
				this.drug_orders_config.currentPage  =  resp.currentPage;
		},err=>{
		});
  }

  goToOrderDetails(orderId:number){
    this.router.navigate(['admin','drug-order','view',orderId]);
  }
}
