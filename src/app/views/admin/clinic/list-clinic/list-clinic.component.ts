import { Component, OnInit, ViewEncapsulation, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-list-clinic',
  templateUrl: './list-clinic.component.html',
  styleUrls: ['./list-clinic.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class ListClinicComponent implements OnInit, AfterViewInit,OnDestroy {

  groupedClinics:any[]=[];
  clinicData = new Array();
  dtOptions!: DataTables.Settings;
  clinic_config:any = {
    filter: {
      STATE: []
    }
  };
  stateList:any[] = [];
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private _toastr: Toastr,
    private route: ActivatedRoute,
    private _http: HttpClient,
    private router: Router,
    private _renderer: Renderer2
  ) {

  }

  ngOnInit() {
    this.getAllFilterList();
    this.getDTOptions();
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }


  getDTOptions() {
    var that=this;
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
       /* set manual filters in req body */
       dataTablesParameters.filter = this.clinic_config.filter.STATE.length > 0 ? this.clinic_config.filter : {}

        this._http
          .post<any>(
            'api/clinics/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.clinicData = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          });
      },
      columns: [
        {
          data: 'doesspot_clinic_id',
          title: 'Clinic ID',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'clinic_name',
          title: 'Clinic Name',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'city',
          title: 'City',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'state',
          title: 'State',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'doctors_count',
          title: 'Doctors',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'is_active',
          title: 'Active Status',
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
            return `<button class="btn btn-default btn-sm m-0" clinicID=${full.doesspot_clinic_id}>View</button>
             &nbsp;&nbsp;
             <button class="btn btn-sm btn-primary m-0" clinicEditID=${full.doesspot_clinic_id}>Edit</button>`;
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
    this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('clinicID')) {
        this.goToDetailsPage(event.target.getAttribute('clinicID'));
      }
      if (event.target.hasAttribute('clinicEditID')) {
        this.goToEditPage(event.target.getAttribute('clinicEditID'));
      }
    });
  }

  ngOnDestroy() {
    if (this.dtTrigger){
      this.dtTrigger.unsubscribe();
    }
    this.listenerFn();
  }

  goToDetailsPage(clinicID: any): any {
    this.router.navigate(['admin','clinic', 'view', clinicID]);
  }

  goToEditPage(clinicEditID: any): any {
    this.router.navigate(['admin','clinic', 'edit', clinicEditID]);
  }

  getAllFilterList(){
    // states
    this._http.get<any>('api/system_states/all').subscribe((resp) => {
      this.stateList = resp;
    },err=>{});
  }

  get notSelectedStates () {
    return this.stateList.filter(({ abbreviation: a }) => !this.clinic_config.filter.STATE.some((b: any) => b === a)).length
  }

  handleChange(event: string, value: any) {
    if(event == 'STATE') {
      this.rerender()
    }
  }

  /* Handle Check all */
  public handleCheckAll (event:any, flag:any) {
    if (flag == 'STATE') {
      if (event.checked) {
        this.clinic_config.filter.STATE = this.stateList.map(({abbreviation}) => abbreviation);
      } else {
        this.clinic_config.filter.STATE = [];
      }
    }
    this.rerender()
  }
}

