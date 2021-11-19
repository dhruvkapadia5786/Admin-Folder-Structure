import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import Hashids from 'hashids';

@Component({
  selector: 'app-tech-list',
  templateUrl: './tech-list.component.html',
  styleUrls: ['./tech-list.component.scss']
})
export class TechListComponent implements OnInit, AfterViewInit,OnDestroy {
  techniciansTableData = new Array();
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;

  dtTrigger: Subject<any> = new Subject();
  constructor(private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private _renderer: Renderer2) {
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
      order: [[4, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/technicians/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.techniciansTableData = resp.data;
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
          data: 'first_name',
          title: 'First Name',
          className: 'text-center  font-weight-normal',
        },
        { data: 'last_name', title: 'Last Name', className: 'text-center  font-weight-normal' },
        {
          data: 'email',
          title: 'Email',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'date_joined',
          title: 'Date Join',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getLocalDate(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
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
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-default btn-sm m-0" technicianID=${full._id}>View</button>
             &nbsp;&nbsp;
             <button class="btn btn-sm btn-primary m-0" technicianEditID=${full._id}>Edit</button>
             &nbsp;&nbsp;
             <button class="btn btn-sm btn-primary m-0" technicianChangePasswordID=${full._id}>Change Password</button>`;
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
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('technicianID')) {
        this.goToDetailsPage(event.target.getAttribute('technicianID'));
      }
      if (event.target.hasAttribute('technicianEditID')) {
        this.goToEditPage(event.target.getAttribute('technicianEditID'));
      }
      if (event.target.hasAttribute('technicianChangePasswordID')) {
        this.goToPasswordChangePage(event.target.getAttribute('technicianChangePasswordID'));
      }
    });
  }

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		if(this.dtTrigger){
			this.dtTrigger.unsubscribe();
    }
    if(this.blockDataTable){this.blockDataTable.unsubscribe();}
    this.listenerFn();
	}

  goToDetailsPage(technicianId: any): any {
    this.router.navigate(['admin', 'technicians', 'view', technicianId]);
  }
  goToEditPage(technicianEditID: any): any {
    this.router.navigate(['admin', 'technicians', 'edit', technicianEditID]);
  }
  goToPasswordChangePage(technicianChangePasswordID: any): any {
    const hashids = new Hashids('', 10);
    const hashid = hashids.encode(technicianChangePasswordID);
    this.router.navigate(['admin', 'changePassword', hashid]);
  }

}
