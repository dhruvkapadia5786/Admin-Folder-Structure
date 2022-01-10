import { Component, OnInit, ViewChild, ViewEncapsulation, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import {ConsultationService} from '../consultation.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { consultationHelper } from 'src/app/services/consultationHelper.service';

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
      CONSULTATION_STATUS:['INCOMPLETE','ASSIGNED_TO_TECHNICIAN','REJECTED','APPROVED_BY_TECHNICIAN','ASSIGNED_TO_DOCTOR','PRESCRIBED_BY_DOCTOR','REFUND_REQUESTED','REFUND_PROCESSED','COMPLETED']
    }
  };
  consultationStatusList:any[] = ['INCOMPLETE','ASSIGNED_TO_TECHNICIAN','REJECTED','APPROVED_BY_TECHNICIAN','ASSIGNED_TO_DOCTOR','PRESCRIBED_BY_DOCTOR','REFUND_REQUESTED','REFUND_PROCESSED','COMPLETED'];

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
    public _consultationHelper:consultationHelper,
    private _http: HttpClient,
    private _renderer: Renderer2) {

    let activeRoute:any = this.route;
    this.healthConditionId = activeRoute.parent.parent.snapshot.paramMap.get('condition_id');
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
              return '<a href="javascript:void(0);" consultationID=' + record._id + ' class="text-primary font-weight-bold">C-' + data + '</a>';
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data:'user.first_name',
          title:'Patient Name',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<a href="javascript:void(0);" customerId=${full.user_id}>${full.user.first_name+' '+full.user.last_name}</a>`;
          }
        },
        {
          data:'health_condition_name',
          title: 'Health Condition',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'shipping_address',
          title: 'State',
          className: 'text-center font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return full.shipping_address ? `${full.shipping_address.state}`:'-';
          }
        },
        {
          data: 'total_amount',
          title: 'Total',
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
             return this._consultationHelper.getSystemStatus(data);
          }
        },
        {
          data: 'created_at',
          title: 'Date',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'DD-MM-YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'consultation_place_datetime',
          title: 'Completed By Customer',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'DD-MM-YYYY');
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
    this._http.get<any>('api/consultation_health_conditions/all').subscribe((resp) => {
      this.healthConditionList = resp;
    }, err=> {});

     // states
     this._http.get<any>('api/system_states/all').subscribe((resp) => {
      this.stateList = resp;
    }, err=> {});

  }

  get notSelectedStates () {
    return this.stateList.filter(({ _id: a }) => !this.consultation_config.filter.STATE.some((b: any) => b === a)).length;
  }

  get notSelectedHealthConditions () {
    return this.healthConditionList.filter(({ _id: a }) => !this.consultation_config.filter.HEALTH_CONDITION.some((b: any) => b === a)).length;
  }

  handleChange(event: string, value: any) {
    if(event == 'STATE' || event == 'HEALTH_CONDITION'  || event == 'CONSULTATION_STATUS') {
      this.rerender()
    }
  }

  /* Handle Check all */
  public handleCheckAll (event:any, flag:any) {
    if (flag == 'STATE') {
      if (event.checked) {
        this.consultation_config.filter.STATE = this.stateList.map(({_id}) => _id);
      } else {
        this.consultation_config.filter.STATE = [];
      }
    }
    if (flag == 'HEALTH_CONDITION') {
      if (event.checked) {
        this.consultation_config.filter.HEALTH_CONDITION = this.healthConditionList.map(({_id}) => _id);
      } else {
        this.consultation_config.filter.HEALTH_CONDITION = [];
      }
    }
    if (flag == 'CONSULTATION_STATUS') {
      if (event.checked) {
        this.consultation_config.filter.CONSULTATION_STATUS = this.consultationStatusList;
      } else {
        this.consultation_config.filter.CONSULTATION_STATUS = [];
      }
    }
    this.rerender()
  }

}
