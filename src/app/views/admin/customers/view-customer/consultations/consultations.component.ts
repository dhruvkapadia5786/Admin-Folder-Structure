import { Component, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { consultationHelper } from 'src/app/services/consultationHelper.service';

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
    public _consultationHelper:consultationHelper,
    private router: Router,
    private _renderer: Renderer2){
    this.getDTOptions();
  }

  ngOnInit() {
    let activeRoute:any=this.route;
    this.parentSub = activeRoute.parent.parent.params.subscribe((params:any) => {
      this.customerId = params['id'];
    });

    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getDTOptions(){
    let that =this;
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
        dataTablesParameters.filter = {};
        dataTablesParameters.filter.CUSTOMER_ID = this.customerId;

        this.blockDataTable.start();
        this._http.post<any>(`api/consultations/list`, dataTablesParameters).subscribe((resp) => {
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
          data:'total_amount',
          title:'Total Amount',
          className: 'text-center',
          render: function (data){
            return that._helper.getInINRFormat('INR', data);
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
				data: 'created_at',
				title: 'Date',
				className: 'text-center',
				render: (data) => {
				  if (data) {
					return this._helper.getFormattedDate(data,'DD-MM-YYYY');
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

  gotoConsultation(consultationID:any){
    this.router.navigate(['admin','consultation','view',consultationID]);
  }

}
