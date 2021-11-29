import { Component, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Helper } from '../../../../../services/helper.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.scss']
})
export class ConsultationsComponent implements OnInit, AfterViewInit {
  public customerId: any;
  public parentSub: any;

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
  ) { this.getDTOptions(); }

  ngOnInit() {
    this.parentSub = this.route.parent?.parent?.params.subscribe(params => {
      this.customerId = params['id'];
    });
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getDTOptions() {
    this.dtOptions ={
			pagingType: 'full_numbers',
			pageLength: 10,
			paging: true,
			serverSide: true,
			search: false,
			searching: false,
			autoWidth: true,
			ordering: true,
			order: [[0, 'desc']],
			ajax: (dataTablesParameters: any, callback:any) => {
        this.blockDataTable.start();
        this._http.post<any>(
          `api/v1/consultation/forPatient?pId=${this.customerId}`,
          dataTablesParameters
        ).subscribe((resp) => {
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
				data:'doctor_name',
				title: 'Physician Name',
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
					return _helper.getInINRFormat('INR', data);
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
					return this._helper.getFormattedDateFromUnixTimestamp(data, 'MM/DD/YYYY');
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
    this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('consultationDetailID')) {
				this.gotoConsultation(event.target.getAttribute('consultationDetailID'));
			}
    });
  }

  gotoConsultation(consultationID:number){
    this.router.navigate(['admin','consultation','view',consultationID]);
    /* this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`/admin/consultation/view/${consultationID}`])
    }); */
  }

}
