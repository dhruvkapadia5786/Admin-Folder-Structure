import { Component, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { consultationHelper } from 'src/app/services/consultationHelper.service';

@Component({
  selector: 'app-doctor-consultations',
  templateUrl: './doctor-consultations.component.html',
  styleUrls: ['./doctor-consultations.component.scss']
})
export class DoctorConsultationsComponent implements OnInit, AfterViewInit {
  doctorId!: number;
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  consultationData: any;
  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    public _helper: Helper,
    public _consultationHelper:consultationHelper,
    private router: Router,
    private _renderer: Renderer2
  ) {
    this.doctorId = this.route.snapshot.params.id;
    this.getConsultations();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getConsultations() {
    let that=this;
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
        dataTablesParameters.filter = {};
        dataTablesParameters.filter.DOCTOR_ID = this.doctorId;

        this.http
          .post<any>(
            'api/consultations/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.consultationData = resp.data;
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
				title: 'Consultation Number',
				className: 'text-center',
				render: function (data:any, type:any, record:any) {
				  return `<a consultationDetailID=${record._id} href="javascript:void(0);" class="text-primary font-weight-bold">C-${data}</a>`;
				}
        },
			  {
          data:'user.first_name',
          title:'Patient Name',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            return `<a href="javascript:void(0);" customerId=${full.user_id}>${full.user.first_name+' '+full.user.last_name}</a>`;
          }
        },
        {
          data:'health_condition_name',
          title: 'Health Condition',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            if (data) {
              return `<a href="javascript:void(0);" healthConditionId=${full.health_condition_id}>${data}</a>`;
              }else{
              return '-'
            }
          }
        },
			  {
          data:'total_amount',
          title:'Consultation Charge',
          className: 'text-center',
          render: function (data) {
            const _helper = new Helper();
            return _helper.getInINRFormat('INR', data);
          }
			  },
			  {
          data:'system_status',
          title: 'Status',
          className: 'text-center',
          render: function (data:any, type:any, record:any) {
            return that._consultationHelper.getSystemStatus(data);
				  }
			  },
			  {
          data: 'consultation_place_datetime',
          title: 'Date',
          className: 'text-center',
          render: (data) => {
            if (data) {
            return this._helper.getFormattedDate(data, 'DD-MM-YYYY hh:mm A');
            } else {
            return '<span></span>';
            }
          }
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('consultationDetailID')) {
        this.goToConsultationPage(event.target.getAttribute('consultationDetailID'));
      }
      if (event.target.hasAttribute('customerId')) {
        this.goToPatientDetails(event.target.getAttribute('customerId'));
      }
      if (event.target.hasAttribute('healthConditionId')) {
        this.goToHealthConditionDetails(event.target.getAttribute('healthConditionId'));
      }
    });
    this.rerender();
  }

  goToConsultationPage(consultationDetailID: any): any {
    this.router.navigate(['admin', 'consultation', 'view', consultationDetailID]);
  }

  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }

  goToHealthConditionDetails(healthConditionId: any): any {
    this.router.navigate(['admin', 'treatment-conditions', 'view', healthConditionId]);
  }
}
