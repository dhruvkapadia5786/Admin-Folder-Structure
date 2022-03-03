import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { CurrencyPipe  } from '@angular/common';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy {
  productsList: any[] = [];
  procurementChannels=['MEDICINE','OTC','PRIVATE LABEL','CONTACT LENS','LENS SOLUTION'];
  product_config:any = {
    filter: {
      CHANNEL: []
    }
  };

  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private router: Router,
    public _helper: Helper,
    private cp:CurrencyPipe,
    private _renderer: Renderer2){
     this.getDTOptions();
  }

  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    let that=this;
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('productID')) {
        that.goToDetailsPage(event.target.getAttribute('productID'));
      }
      if (event.target.hasAttribute('productEditId')) {
        that.goToEditPage(event.target.getAttribute('productEditId'));
      }
    });
  }

  goToDetailsPage(productID: any): any {
    this.router.navigate(['admin', 'products', 'view', productID]);
  }

  goToEditPage(productEditId: any): any {
    this.router.navigate(['admin', 'products', 'edit', productEditId]);
  }

  handleChange(event: string, value: any) {
    if(event == 'CHANNEL'){
      this.rerender();
    }
  }

  public handleCheckAll(event:any, flag:any) {
    if (flag == 'CHANNEL'){
      if (event.checked){
        this.product_config.filter.CHANNEL = this.procurementChannels;
      } else {
        this.product_config.filter.CHANNEL = [];
      }
    }
    this.rerender();
  }

  get notSelectedChannels(){
    return this.procurementChannels.filter((item) => !this.product_config.filter.CHANNEL.some((b: any) => b === item)).length;
  }

  ngOnDestroy(){
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
    if(this.blockDataTable){this.blockDataTable.unsubscribe();}
    this.listenerFn();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  getDTOptions(){
    this.blockDataTable.start();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[2, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
       dataTablesParameters.filter = this.product_config.filter.CHANNEL.length > 0 ? this.product_config.filter : {}
        this._http
          .post<any>(
            'api/products/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.blockDataTable.stop();
            this.productsList = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          },(error:any)=>{
            this.blockDataTable.stop();
            callback({
              recordsTotal: 0,
              recordsFiltered:0,
              data:[]
            });
          });
      },
      columns: [
        {
          data:'image_url',
          title: 'Image',
          orderable: false,
          className: 'text-left  font-weight-normal',
          render: (data: any) => {
            if (data) {
              return `<img src='${environment.api_url + data}' height="100" width="100" />`;
            } else {
              return ``;
            }
          }
        },
        {
          data: 'name',
          title: 'Product Name',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'mrp_price',
          title: 'MRP Price',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this.cp.transform(data, 'INR');
            } else {
              return '<span>-</span>';
            }
          },
        },
        {
          data: 'sale_price',
          title: 'Sale Price',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this.cp.transform(data, 'INR');
            } else {
              return '<span>-</span>';
            }
          },
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'is_coming_soon',
          title: 'Coming Soon',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'created_at',
          title: 'Created At',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'DD-MM-YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `
            <button class="btn btn-default btn-sm m-0" productID=${full._id}>View</button>
            <br/>
             <button class="btn btn-sm btn-primary m-0" productEditId=${full._id}>Edit</button>`;
          },
          orderable: false
        }
      ]
    };

  }
}
