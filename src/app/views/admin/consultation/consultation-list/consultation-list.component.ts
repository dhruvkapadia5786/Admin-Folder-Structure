import { Component, OnInit, ViewChild, ViewEncapsulation, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import {ConsultationService} from '../consultation.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultationListComponent implements OnInit,AfterViewInit,OnDestroy {

  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  consultation_config:any = {
    filter: {
      STATE: [],
      HEALTH_CONDITION: [],
      CONSULTATION_STATUS: ''
    }
  };
  consultationStatusList:any[] = [
    {name: "-- SELECT --", id:''},
    {name: "ASSIGNED TO TECHNICIAN", id:'ASSIGNED_TO_TECHNICIAN'},
    {name: "APPROVED BY TECHNICIAN", id:'APPROVED_BY_TECHNICIAN'},
    {name: "ASSIGNED TO DOCTOR", id:'ASSIGNED_TO_DOCTOR'},
    {name: "CONSULTATION COMPLETED", id:'CONSULTATION_COMPLETED'},
    {name: "CONSULTATION REFUND REQUESTED", id:'CONSULTATION_REFUND_REQUESTED'},
    {name: "CONSULTATION REFUND PROCESSED", id:'CONSULTATION_REFUND_PROCESSED'},
    {name: "REJECTED BY TECHNICIAN", id:'REJECTED_BY_TECHNICIAN'},
    {name: "INCOMPLETE", id:'INCOMPLETE'}
  ];
  stateList:any[] = [];
  healthConditionList: any[] = [];

  healthConditionId: any;
  selectedHealthCondition: any;
  showHeaderAndFilter: boolean = true;
  disableHealthConditionSelect: boolean = false;

  constructor(private _consultationService:ConsultationService,
    private route: ActivatedRoute,
    private router: Router,
    public _helper: Helper,
    private _http: HttpClient,
    private _renderer: Renderer2) {

    this.healthConditionId = this.route.parent?.parent?.snapshot.paramMap.get('condition_id') ? parseInt(this.route.parent.parent.snapshot.paramMap.get('condition_id')!) : null;
    if (this.healthConditionId) {
      this.showHeaderAndFilter = false
      this.disableHealthConditionSelect = true
      this.consultation_config.filter.HEALTH_CONDITION.push(this.healthConditionId);
    }
    this.getDTOptions();
  }

  ngOnInit() {
    this.getAllFilterList();
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
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
          /* set manual filters in req body */
          dataTablesParameters.filter = {};
          dataTablesParameters.filter.STATE = this.consultation_config.filter.STATE.length > 0 ? this.consultation_config.filter.STATE : undefined;
          dataTablesParameters.filter.HEALTH_CONDITION = this.consultation_config.filter.HEALTH_CONDITION.length > 0 ? this.consultation_config.filter.HEALTH_CONDITION : undefined;
          dataTablesParameters.filter.CONSULTATION_STATUS = this.consultation_config.filter.CONSULTATION_STATUS != '' ? this.consultation_config.filter.CONSULTATION_STATUS : undefined;

        this.blockDataTable.start();
        this._consultationService.getAllConsultation(dataTablesParameters).then((resp:any) => {
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
          data: 'consultation_number',
          title: 'Consultation #',
          className: 'text-center  font-weight-normal',
          render: function (data, type, record) {
            if (data) {
              return '<a href="javascript:void(0);" consultationID=' + record.id + ' class="text-primary font-weight-bold">C-' + data + '</a>';
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data:'consultation_type',
          title: 'Consultation Type',
          className: 'text-center  font-weight-normal',
          render: function (data:any, type:any, record:any) {
            if (data=='NEW') {
            return '<span class="badge badge-success">New</span>'
            }else{
            return '<span class="badge badge-primary">Followup</span>'
            }
          }
        },
        {
          data:'type',
          title: 'Type',
          className: 'text-center  font-weight-normal',
          render: function (data, type, record) {
            if (data=='REFERRED_BY_PHYSICIAN') {
              return '<span class="badge badge-success">Referred By Physician</span>'
            }else{
              return '<span class="badge badge-warning">First Available Physician</span>'
            }
          }
        },
        {
          data:'patient_name',
          title:'Patient Name',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<a href="javascript:void(0);" customerId=${full.user_id}>${data}</a>`;
          }
        },
        {
          data:'health_conditions_name',
          title: 'Health Condition',
          className: 'text-center  font-weight-normal',
        },
			  {
				data:'clinic_name',
				title:'Clinic',
				className: 'text-center  font-weight-normal',
				render: function (data:any, type:any, record:any) {
				  if (data) {
				    	return record.clinic_name +'<br/>'+record.city + ' , '+record.state;
				  }else{
					    return '-'
				    }
				  }
			  },
        {
          data:'doctor_name',
          title:'Doctor Name',
          className: 'text-center  font-weight-normal',
          render: function (data, type, record) {
            if (data) {
              return data;
            }else{
              return '-'
            }
          }
        },
        {
          data: 'consultation_charge',
          title: 'Charge Amount',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            return this._helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'system_status',
          title: 'Status',
          className: 'text-center  font-weight-normal',
          render: (data) => {
             if(data=='ASSIGNED_TO_TECHNICIAN'){return `<span class="badge badge-info">Assigned To Technician</span>`;}
             else if(data=='APPROVED_BY_TECHNICIAN'){return `<span class="badge badge-info">Approved By Technician</span>`;}
             else if(data=='REJECTED_BY_TECHNICIAN'){return `<span class="badge badge-danger">Rejected By Technician</span>`;}
             else if(data=='ASSIGNED_TO_DOCTOR'){return `<span class="badge badge-primary">Assigned To Doctor</span>`}
             else if(data=='CONSULTATION_COMPLETED'){return `<span class="badge badge-success">Completed</span>`}
             else if(data=='CONSULTATION_REFUND_REQUESTED'){return `<span class="badge badge-danger">Refund Requested</span>`}
             else if(data=='CONSULTATION_REFUND_PROCESSED'){return `<span class="badge badge-danger">Refund Processed</span>`}
             else if(data=='INCOMPLETE'){return `<span class="badge badge-warning">Incomplete</span>`}
             else {return '';}
          }
        },
        {
          data: 'created_at',
          title: 'Date',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'completed_by_customer_at',
          title: 'Completed By Customer',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        }
      ]
    }
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
    this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('consultationID')) {
        this.goToDetailsPage(event.target.getAttribute('consultationID'));
      }
      if (event.target.hasAttribute('customerId')) {
        this.goToPatientDetails(event.target.getAttribute('customerId'));
      }
    });
  }

  ngOnDestroy(){
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
    if(this.blockDataTable){
      this.blockDataTable.unsubscribe();
    }
  }

  goToDetailsPage(consultationID: any): any {
    this.router.navigate(['admin', 'consultation', 'view', consultationID]);
  }

  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }

  getAllFilterList() {
    // health conditions
    this._http.post<any>('api/v1/admin/consultation/health_condition/all', {}).subscribe((resp) => {
      this.healthConditionList = resp.data;
    }, err=> {});

    // states
    this._http.post<any>('api/v1/admin/states/all', {}).subscribe((resp) => {
      this.stateList = resp.data;
    }, err=> {});

  }

  get notSelectedStates () {
    return this.stateList.filter(({ abbreviation: a }) => !this.consultation_config.filter.STATE.some((b: any) => b === a)).length;
  }

  get notSelectedHealthConditions () {
    return this.healthConditionList.filter(({ id: a }) => !this.consultation_config.filter.HEALTH_CONDITION.some((b: any) => b === a)).length;
  }

  handleChange(event: string, value: any) {
    if(event == 'STATE' || event == 'HC'  || event == 'CS') {
      this.rerender()
    }
  }

  /* Handle Check all */
  public handleCheckAll (event:any, flag:any) {
    if (flag == 'STATE') {
      if (event.checked) {
        this.consultation_config.filter.STATE = this.stateList.map(({abbreviation}) => abbreviation);
      } else {
        this.consultation_config.filter.STATE = [];
      }
    }
    if (flag == 'HC') {
      if (event.checked) {
        this.consultation_config.filter.HEALTH_CONDITION = this.healthConditionList.map(({name}) => name);
      } else {
        this.consultation_config.filter.HEALTH_CONDITION = [];
      }
    }
    this.rerender()
  }

}
