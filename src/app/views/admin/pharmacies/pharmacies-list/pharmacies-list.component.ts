import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-pharmacies-list',
  templateUrl: './pharmacies-list.component.html',
  styleUrls: ['./pharmacies-list.component.scss']
})
export class PharmaciesListComponent implements OnInit, AfterViewInit,OnDestroy {
  pharmaciesTableData = [];

  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  @BlockUI('datatable') blockDataTable!: NgBlockUI;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private _renderer: Renderer2){

  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    this.getDTOptions();
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
      order: [[4, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/pharmacies/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.pharmaciesTableData = resp.data;
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
          data:'pharmacy_name',
          title: 'Pharmacy Name',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'city_name',
          title: 'City',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'state_name',
          title: 'State',
          className: 'text-center  font-weight-normal'
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
          data: 'doesspot_pharmacy_id',
          title: 'DS Linked',
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
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-default btn-sm m-0" pharmId=${full._id}>Add<i class="ml-2 fas fa-eye"></i></button>
             &nbsp;&nbsp;
             <button class="btn btn-sm btn-primary m-0" pharmEditId=${full._id}>Edit<i class="ml-2 fas fa-edit"></i></button>`;
          },
          orderable: false
        }
      ]
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    let that=this;
    this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('pharmId')) {
        that.goToDetailsPage(event.target.getAttribute('pharmId'));
      }
      if (event.target.hasAttribute('pharmEditId')) {
        that.goToEditPage(event.target.getAttribute('pharmEditId'));
      }
    });
  }

  ngOnDestroy() {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
  }

  goToDetailsPage(pharmId: any): any {
    this.router.navigate(['admin', 'pharmacies', 'view', pharmId]);
  }
  goToEditPage(pharmEditId: any): any {
    this.router.navigate(['admin', 'pharmacies', 'edit', pharmEditId]);
  }

}
