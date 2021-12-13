import { Component, OnInit, ChangeDetectorRef , Inject,ViewChild, Renderer2, AfterViewInit,OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-refund-requested',
  templateUrl: './refund-requested.component.html',
  styleUrls: ['./refund-requested.component.scss']
})
export class RefundRequestedComponent implements OnInit, AfterViewInit, OnDestroy {

  consultationTableData:any[]=[];
  selectedConsultation:any;
  refund_processing:boolean=false;

  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  constructor(private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    public _toaster: Toastr,
    public _cdr: ChangeDetectorRef,
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
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            `api/consultation/refund_requested`,
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
          data: 'charged_from_stripe',
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
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            let visible= full.consultation_charge>0?'block':'none';
            return `<button style="display:${visible}" class="btn btn-danger btn-sm m-0" refundOrderId=${full.id}> REFUND </button>`;
          }
        }
      ]
    };
  }

  refundConsultation(consultationId: number,full_refund:number) {
      let url:string = 'api/consultation/processRefund';
      this.refund_processing=true;
      this._http.post(url, { consultation_id: consultationId ,full_refund_in_wallet:full_refund})
        .subscribe((res: any) => {
          this.refund_processing=false;
          this.selectedConsultation.result = res;

          if (res.refunded) {
            let stripeRefund= res.stripeRefund ? res.stripeRefund.id:'N/A';
            let walletRefund= res.walletRefund ? 'Yes':'N/A';
            this._toaster.showSuccess(`Consultation Refunded Successfully. Refunded To Stripe : ${stripeRefund} , Refunded To Wallet : ${walletRefund}`);
          } else {
            this._toaster.showWarning('Unable to refund consultation. Please Check Payment Method!');
          }
          this.rerender();
        },(err) => {

          this.refund_processing=false;
          this._toaster.showError('Unable to refund consultation. Please try again :'+err.error.error);
        });
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
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
      if(event.target.hasAttribute('refundOrderId')){
        event.stopPropagation();
        this.callProcessrefund(event.target.getAttribute('refundOrderId'));
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

  callProcessrefund(consultationId:number){
    this.selectedConsultation = this.consultationTableData.find((consultation:any)=>consultation.id==consultationId);

  }

  openModal(modal:any){

  }

  closeModal(modal:any){
    this.selectedConsultation = null;
  }

}
