import { Component, OnInit, ChangeDetectorRef , ViewChild, Renderer2, AfterViewInit,OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-refund-processed',
  templateUrl: './refund-processed.component.html',
  styleUrls: ['./refund-processed.component.scss']
})
export class RefundProcessedComponent implements OnInit, AfterViewInit, OnDestroy {

  consultationTableData:any[]=[];
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
      order: [[8, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            `api/consultation/refund_processed`,
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {

            this.consultationTableData = resp.data;
            this.blockDataTable.stop();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          }, (err) => {
            this.consultationTableData = []
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: []
            });
            this.blockDataTable.stop();
          });
      },
      columns: [
        {
          data: 'consultation_number',
          title: 'Consultation Number',
          className: 'text-center  font-weight-normal',
          render: function (data, type, record) {
            if (data) {
              return '<a href="javascript:void(0);" consultationId=' + record.id + ' class="text-primary font-weight-bold">' + data + '</a>';
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'customer_name',
          title: 'Customer Name',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<a href="javascript:void(0);" class="text-primary font-weight-bold" customerId=${full.user_id}>${full.customer_name}</a>`;
          }
        },
        {
          data: 'health_condition',
          title: 'Health Condition',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'consultation_charge',
          title: 'Total Amount',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            return this._helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'charged_from_paymentgateway',
          title: 'Charged From Stripe',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            return this._helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'charged_from_wallet',
          title: 'Charged From Wallet',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            return this._helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'consultation_refund_reason',
          title: 'Reason',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'refund_id',
          title: 'Stripe Refund Id',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return data? (full.charged_from_paymentgateway>0? `<a target="_blank" href="https://dashboard.stripe.com/payments/${full.charge_id}">${data}</a>`:data) : '-';
          }
        },
        {
          data: 'consultation_refund_processed_on',
          title: 'Processed On',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
      ]
    };
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
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
      if (event.target.hasAttribute('consultationId')) {
        this.goToDetailsPage(event.target.getAttribute('consultationId'));
      }
      if (event.target.hasAttribute('customerId')) {
        this.goToPatientDetails(event.target.getAttribute('customerId'));
      }
    });
  }

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		if (this.dtTrigger) {
			this.dtTrigger.unsubscribe();
    }
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
      });
    }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
	}

  goToDetailsPage(consultationId: any): any {
    this.router.navigate(['admin', 'consultation', 'view', consultationId]);
  }
  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }

}
