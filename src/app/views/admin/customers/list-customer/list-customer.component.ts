import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Helper } from '../../../../services/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit, AfterViewInit,OnDestroy {
  dtOptions!: DataTables.Settings;
  patientsTableData: any[] = [];
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  public counts : any;

  patient_config:any = {
    filter: {
      STATE: [],
      GENDER: '',
      AGE: ''
    }
  };
  stateList:any[] = [];
  ageList: any[] = ['18-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80+'];

  constructor(
    public _http: HttpClient,
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
    this.getAllFilterList();
    this.getAllCustomerCounts();
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('patientID')) {
        this.goToDetailsPage(event.target.getAttribute('patientID'));
      }
      if (event.target.hasAttribute('patientEditID')) {
        this.goToEditPage(event.target.getAttribute('patientEditID'));
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


  get notSelectedStates () {
    return this.stateList.filter(({ id: a }) => !this.patient_config.filter.STATE.some((b: any) => b === a)).length;
  }

  getAllFilterList() {
    // Get State List
    this._http.get<any>('api/system_states/all').subscribe((resp) => {
      this.stateList = resp;
    }, err=> {});
  }

  public handleCheckAll (event:any, flag:any) {
    if (event.checked) {
      this.patient_config.filter.STATE = this.stateList.map(({_id}) => _id);
    } else {
      this.patient_config.filter.STATE = [];
    }
    $('#patientsList').DataTable().ajax.reload();
  }

  getAllCustomerCounts() {
    const url = 'api/customers/getCounts';
    this._http.get(url)
      .subscribe((response: any) => {
        this.counts = response;
      }, err => {

      });
  }

  goToDetailsPage(patientID: any): any {
    this.router.navigate(['admin', 'patients', 'view', patientID, 'info']);
  }
  goToEditPage(patientEditID: any): any {
    this.router.navigate(['admin', 'patients', 'edit', patientEditID]);
  }

  getDTOptions() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      paging: true,
      serverSide: true,
      // processing: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[9, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        /* set manual filters in req body */
        dataTablesParameters.filter = {};
        dataTablesParameters.filter.STATE = this.patient_config.filter.STATE.length > 0 ? this.patient_config.filter.STATE : undefined;
        dataTablesParameters.filter.GENDER = this.patient_config.filter.GENDER != '' ? this.patient_config.filter.GENDER : undefined;
        dataTablesParameters.filter.AGE = this.patient_config.filter.AGE != '' ? this.patient_config.filter.AGE : undefined;

        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/customers/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.patientsTableData = resp.data;
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
          title: 'Name',
          className: 'text-left  font-weight-normal',
          render: (data: any, type: any, record: any) => {
            if (data) {
              return `<a class="text-primary font-weight-bold" href="javascript:void(0);" patientID=${record._id}>${data.charAt(0).toUpperCase() + data.slice(1) +' '+record.last_name}</a>`;
            } else {
              return `<span></span>`;
            }
          }
        },
        {
          data: 'email',
          title: 'Email',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'cell_phone_number',
          title: 'Phone',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, record: any) => {
            if (data) {
              return `<span>${data}</span>`;
            } else {
              return `<span></span>`;
            }
          }
        },
        {
          data: 'default_address.city',
          title: 'City',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'default_address.state',
          title: 'State',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'default_address.zip_code',
          title: 'ZipCode',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'profile_picture',
          title: 'Profile / ID',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, record: any) => {
            if (data !== null && record.license_photo !== null) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'doesspot_patient_id',
          title: 'DS',
          className: 'text-center  font-weight-normal',
          render: (data: any,type:any,record:any) => {
            if (data) {
              return `<a href="/admin/patients/doesspot/${record._id}/${data}" target="_blank">${data}</a>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },{
          data: 'date_joined',
          title: 'Member Since',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data) {
              return this._helper.getLocalDate(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, record: any) {
            return `<button class="btn btn-default btn-sm m-0" patientID=${record._id}><i class="fa fa-eye"></i></button>
            <br/>
            <button class="btn btn-sm btn-primary mt-2" patientEditID=${record._id}><i class="fa fa-edit"></i></button>`;
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

  handleChange(event: string, value: any) {
    $('#patientsList').DataTable().ajax.reload();
  }

  clearFilter() {
    this.patient_config = {filter: {STATE: [], GENDER: [], AGE: []}}
    $('#patientsList').DataTable().ajax.reload();
  }
}
