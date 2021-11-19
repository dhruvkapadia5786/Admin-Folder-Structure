import { Component, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';

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
    private _helper: Helper,
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
        this.http
          .post<any>(
            'api/v1/consultation/consultation_history_for_doctor/' + this.doctorId,
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
				  return `<a consultationDetailID=${record.id} href="javascript:void(0);" class="text-primary font-weight-bold">C-${data}</a>`;
				}
        },
        {
          data:'consultation_type',
          title: 'Consultation Type',
          className: 'text-center',
            render: function (data:any, type:any, record:any) {
              if (data=='NEW') {
              return '<span class="badge badge-success">NEW</span>'
              }else{
              return '<span class="badge badge-primary">FOLLOWUP</span>'
              }
            }
          },
          {
          data:'type',
          title: 'Type',
          className: 'text-center',
          render: function (data:any, type:any, record:any) {
            if (data=='REFERRED_BY_PHYSICIAN') {
            return '<span class="badge badge-primary">Referred By Physician</span>'
            }else{
            return '<span class="badge badge-warning">First Available Physician</span>'
            }
          }
        },
			  {
          data:'patient_name',
          title:'Patient Name',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            return `<a href="javascript:void(0);" customerId=${full.user_id}>${data}</a>`;
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
				data:'pharmacy_name',
				title:'Pharmacy Name',
				className: 'text-center',
				render: function (data:any, type:any, record:any) {
				  if (data) {
					return data;
				  }else{
					return '-'
				  }
				}
			  }, 
			  {
				data:'consultation_charge',
				title:'Consultation Charge',
				className: 'text-center',
				render: function (data) {
					const _helper = new Helper();
					return _helper.getInDollarFormat('USD', data);
				}
			  }, 
			  {
				data:'system_status',
				title: 'Status',
				className: 'text-center',
				render: function (data:any, type:any, record:any) {
          if(data=='ASSIGNED_TO_TECHNICIAN'){return `<span class="badge badge-info">Assigned To Technician</span>`;}
          if(data=='APPROVED_BY_TECHNICIAN'){return `<span class="badge badge-info">Approved To Technician</span>`;}
          else if(data=='ASSIGNED_TO_DOCTOR'){return `<span class="badge badge-primary">Assigned To Doctor</span>`}
          else if(data=='CONSULTATION_COMPLETED'){return `<span class="badge badge-success">Completed</span>`}
          else if(data=='CONSULTATION_REFUNDED'){return `<span class="badge badge-danger">Refunded</span>`}
          else {return '';}
				}
			  },
			  {
				data: 'created_at',
				title: 'Date',
				className: 'text-center',
				render: (data) => {
				  if (data) {
					return this._helper.getLocalDate(data, 'MM/DD/YYYY');
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
