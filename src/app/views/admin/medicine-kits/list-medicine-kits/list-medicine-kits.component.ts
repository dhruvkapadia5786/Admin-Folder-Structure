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
  selector: 'app-list-medicine-kits',
  templateUrl: './list-medicine-kits.component.html',
  styleUrls: ['./list-medicine-kits.component.scss']
})
export class ListMedicineKitsComponent implements OnInit, AfterViewInit, OnDestroy {
  medicineKitList: any[] = [];

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
      if (event.target.hasAttribute('medicineKitID')) {
        that.goToDetailsPage(event.target.getAttribute('medicineKitID'));
      }
      if (event.target.hasAttribute('medicineKitEditId')) {
        that.goToEditPage(event.target.getAttribute('medicineKitEditId'));
      }
    });
  }

  goToDetailsPage(medicineKitID: any): any {
    this.router.navigate(['admin', 'medicine-kits', 'view', medicineKitID]);
  }

  goToEditPage(medicineKitEditId: any): any {
    this.router.navigate(['admin', 'medicine-kits', 'edit', medicineKitEditId]);
  }

  ngOnDestroy() {
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

  getDTOptions() {
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
        this._http
          .post<any>(
            'api/medicine_kits/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.blockDataTable.stop();
            this.medicineKitList = resp.data;
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
          title: 'Medicine Kit Name',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'price',
          title: 'Actual Price',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this.cp.transform(data, 'USD');
            } else {
              return '<span>-</span>';
            }
          },
        },
        {
          data: 'pharmacy_price',
          title: 'Pharmacy Price',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this.cp.transform(data, 'USD');
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
              return ''
              //this._helper.getLocalDate(data, 'MM/DD/YYYY');
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
            <button class="btn btn-default btn-sm m-0" medicineKitID=${full._id}>View</button>
            <br/>
             <button class="btn btn-sm btn-primary m-0" medicineKitEditId=${full._id}>Edit</button>`;
          },
          orderable: false
        }
      ]
    };

  }



}
