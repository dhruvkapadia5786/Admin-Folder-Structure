import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-user-cart-list',
  templateUrl: './user-cart-list.component.html',
  styleUrls: ['./user-cart-list.component.scss']
})
export class UserCartListComponent implements OnInit {
  config:any;
	collection:any = { count: 0, data: [] };
  hasMorePages:boolean=false;

  selectedPatient:any;
  loading:boolean=false;
  search:string='';

  constructor(
    private _http: HttpClient,
		private _toastr: Toastr,
    private _changeDetectorRef:ChangeDetectorRef,
    public helper: Helper){
      this.config = {
        itemsPerPage:20,
        currentPage: 1,
        totalItems: this.collection.count
      };
  }

  ngOnInit(){
		this.getPatientList(this.config.currentPage,this.config.itemsPerPage,this.search);
  }

  searchPatient(event:any){
      this.getPatientList(this.config.currentPage,this.config.itemsPerPage,this.search);
  }

  pageChanged(event:any){
		this.config.currentPage = event;
		this.getPatientList(this.config.currentPage,this.config.itemsPerPage,this.search);
  }

  loadSubscriptionsForPatients(patient:any){
    this.selectedPatient =patient;
    this.loading= true;
    this._http.get<any>(`api/pharmacy_orders/customer-cart/${patient.patient_id}`).subscribe((resp:any) => {
        this.selectedPatient = {
          ...patient,
          ...resp
        }
        this.loading= false;
        this._changeDetectorRef.detectChanges();
    });
  }

  sendReminderMailForCart(patient_id:number){

  }

  getPatientList(page:number,limit:number,search:string){
		this._http.get<any>(`api/pharmacy_orders/cart_customer_list?page=${page}&limit=${limit}&search=${search}`).subscribe((resp:any) => {
				this.collection.data = resp.data;
				this.collection.count= resp.total;
				this.config.itemsPerPage =  resp.perPage;
				this.config.totalItems = resp.total;
				this.config.currentPage  =  resp.currentPage;
        this.hasMorePages = resp.hasMorePages;
		},err=>{
		});
  }
}
