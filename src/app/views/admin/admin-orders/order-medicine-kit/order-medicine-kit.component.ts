import { Component, OnInit,Input,OnChanges,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'app-order-medicine-kit',
  templateUrl: './order-medicine-kit.component.html',
  styleUrls: ['./order-medicine-kit.component.scss']
})
export class OrderMedicineKitComponent implements OnInit{

  @Input() orderDetails: any;
  loading = true;
  api_url = environment.api_url ;

  constructor(
    private _route: ActivatedRoute,
    private _toastr: Toastr,
    private _cdr:ChangeDetectorRef,
    private _http: HttpClient){

  }

  ngOnInit() {

  }

}
