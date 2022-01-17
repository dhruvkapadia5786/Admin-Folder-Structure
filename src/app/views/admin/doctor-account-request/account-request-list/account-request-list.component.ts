import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from '../../../../services/helper.service';

@Component({
  selector: 'app-account-request-list',
  templateUrl: './account-request-list.component.html',
  styleUrls: ['./account-request-list.component.scss']
})
export class AccountRequestListComponent implements OnInit, AfterViewInit,OnDestroy {
  doctorTableData = new Array();
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private _renderer: Renderer2
  ) {
    this.getDTOptions();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getDTOptions() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      // processing: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/doctor_account_requests/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.doctorTableData = resp.data;
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
          data: '_id',
          title: 'Id',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'first_name',
          title: 'First Name',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'last_name',
          title: 'Last Name',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'email',
          title: 'Email',
          className: 'text-center  font-weight-normal'
        },
        {
          data:'registration_code_used',
          title: 'Code Used',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'status',
          title: 'Status',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
             if(data=='PENDING'){
                return `<span class="badge badge-warning">${data}</span>`;
             }else if(data=='APPROVED'){
              return `<span class="badge badge-success">${data}</span>`;
              }
             else {
              return `<span class="badge badge-danger">${data}</span>`
             }
          }
        },
        {
          data: 'deleted',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data==0) {
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
            return `<button class="btn btn-default btn-sm m-0" doctorID=${full._id}>View <i class="fas fa-eye"></i></button>`;
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

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.listenerFn=this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('doctorID')) {
        this.goToDetailsPage(event.target.getAttribute('doctorID'));
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

  goToDetailsPage(doctorID: any): any {
    this.router.navigate(['admin', 'account-request', 'view', doctorID]);
  }

}
