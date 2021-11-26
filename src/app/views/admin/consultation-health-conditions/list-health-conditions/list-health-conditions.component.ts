
import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-health-conditions',
  templateUrl: './list-health-conditions.component.html'
})
export class ListHealthConditionsComponent implements OnInit, AfterViewInit, OnDestroy {
  HealthConditionsTableData = [];
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions!: DataTables.Settings;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private cp: CurrencyPipe,
    private _http: HttpClient,
    private router: Router,
    private _renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.getDTOptions();
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('healthConditionsEditId')) {
        this.router.navigate(['admin','consultation-health-conditions','edit',event.target.getAttribute('healthConditionsEditId')]);
      }
      if (event.target.hasAttribute('healthConditionsViewId')) {
        this.router.navigate(['admin','consultation-health-conditions','view',event.target.getAttribute('healthConditionsViewId')]);
      }
    });
  }

  ngOnDestroy() {
    if (this.dtTrigger){
      this.dtTrigger.unsubscribe();
    }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
  }

  getDTOptions() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      paging: true,
      serverSide: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[6, 'asc']],
      ajax: (dataTablesParameters: any, callback) => {
        /* set manual filters in req body */
        dataTablesParameters.filter = {};

        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/consultation_health_conditions/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {

            this.HealthConditionsTableData = resp.data;
            this.blockDataTable.stop();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          });
      },
      columns: [
        {
          data:'image_url',
          title: 'Image',
          orderable: false,
          className: 'text-left  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<img src='${environment.api_url + data}' height="100" width="100" />`;
            } else {
              return ``;
            }
          }
        },
        {
          data: 'name',
          title: 'Health Conditions Name',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'price',
          title: 'Price',
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
          data: 'offer_price',
          title: 'Offer Price',
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
          data: 'doctor_price',
          title: 'Doctor Price',
          className: 'text-center font-weight-normal',
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
          title: 'Is Coming Soon',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data==1) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-default btn-sm m-0" healthConditionsViewId=${full._id}>View</button>
            <br/><button type="button" class="btn btn-sm btn-primary m-0" healthConditionsEditId="${full._id}">Edit</button>`;
          },
          orderable: false
        }
      ]
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }


}
