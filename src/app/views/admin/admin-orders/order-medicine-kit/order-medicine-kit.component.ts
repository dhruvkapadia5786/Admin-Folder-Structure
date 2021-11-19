import { Component, OnInit,Input,OnChanges,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { QUANTITY, WEIGHT } from 'src/app/enums/medicine.enum';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-order-medicine-kit',
  templateUrl: './order-medicine-kit.component.html',
  styleUrls: ['./order-medicine-kit.component.scss']
})
export class OrderMedicineKitComponent implements OnInit,OnChanges{

  @Input() orderDetails: any;
  loading = true;
  api_url = environment.api_url ;
  
  parentSub: any;
  medicineKit:any
  QUANTITY = QUANTITY;
  WEIGHT = WEIGHT;
  kitUrl:string='';

  constructor(
    private _route: ActivatedRoute,
    private _toastr: Toastr,
    private _cdr:ChangeDetectorRef,
    private _http: HttpClient){

      if(this.orderDetails && this.orderDetails.medicine_kit_id){
         this.getmedicineKitDetails();
      }
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    if(this.orderDetails && this.orderDetails.medicine_kit_id){         
      this.getmedicineKitDetails();
    }
  }

  getmedicineKitDetails() {
    let url = `api/v1/new_orders/order_kit_with_medicines/${this.orderDetails.id}`;
    this._http.get<any>(url).subscribe((data) => {
      if (data) {
        this.medicineKit = data;
        
        let firstWord = this.medicineKit.name.split(' ')[0].toLowerCase();
        if(firstWord=='sildenafil'){
          this.kitUrl= 'https://www.teledaddy.com/sildenafil';
        }else if(firstWord =='tadalafil'){
          this.kitUrl= 'https://www.teledaddy.com/tadalafil';
        }else{
          this.kitUrl=  this.medicineKit.tab_url? this.medicineKit.tab_url:'https://www.teledaddy.com/';
        }
        this.loading = false;
      } else {
        this._toastr.showError('Unable to fetch medicine details');
        this.loading = false;
      }
    })
  }
}
