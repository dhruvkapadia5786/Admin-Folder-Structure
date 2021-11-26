import { Component, OnInit,Inject, ChangeDetectorRef , ViewChild, Renderer2, AfterViewInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Helper } from 'src/app/services/helper.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
// import {ModalDirective} from 'angular-bootstrap-md';
// import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-refund-incomplete-orders',
  templateUrl: './refund-incomplete-orders.component.html'
})
export class RefundIncompleteOrdersComponent implements OnInit,AfterViewInit {

  ordersTableData:any[]=[];
  selectedOrder:any;
  refund_processing:boolean=false;

  // @ViewChild(ModalDirective) modal: ModalDirective;

  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  constructor(private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    public _toaster: ToastrService,
    public _cdr: ChangeDetectorRef,
    // @Inject(DOCUMENT) private document: any,
    private _renderer: Renderer2) {
    this.getDTOptions();
  }



  refundOrder(orderId: number,total_amount:number) {
    this.refund_processing=true;
    const url1 = 'api/v1/new_orders/refund';
    this._http.post(url1,{order_id:orderId,initiated_by:''}) .subscribe((res: any) => {

      if(total_amount>0){
        const process_refund_url = 'api/v1/admin/orders/processRefund';
        this._http.post(process_refund_url, { order_id: orderId }).subscribe((res: any) => {
          this.refund_processing=false;
          this.selectedOrder.result = res;
          if (res.refunded) {
            let stripeRefund= res.stripeRefund ? res.stripeRefund.id:'N/A';
            let walletRefund= res.walletRefund ? 'Yes':'N/A';
            this._toaster.success(`Order Refunded Successfully. Refunded To Stripe : ${stripeRefund} , Refunded To Wallet : ${walletRefund}`);
          } else {
            this._toaster.warning('Unable to refund order. Please Check Payment Method!');
          }
          this.rerender();
        }, (err) => {
            this.refund_processing=false;

            this._toaster.error('Unable to refund order. Please try again');
        });
      }else{
        this.selectedOrder.result = {
           refunded:true
        };
        this.refund_processing=false;
        this._toaster.success(`Order Refunded Successfully.`);
        this.rerender();
      }
    }, (err) => {
          this.refund_processing=false;

          this._toaster.error('Unable to refund order. Please try again');
    });
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
            `api/v1/admin/orders/paymentComplete/orderIncomplete`,
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {

            this.ordersTableData = resp.data;
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
          data: 'order_number',
          title: 'Order Number',
          className: 'text-center  font-weight-normal',
          render: function (data, type, record) {
            if (data) {
              return '<a href="javascript:void(0);" orderID=' + record.id + ' class="text-primary font-weight-bold">' + data + '</a>';
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
            return `<a href="javascript:void(0);" class="text-primary font-weight-bold" customerId=${full.tele_daddy_user_id}>${full.customer_name}</a>`;
          }
        },
        {
          data: 'medicine_kit_name',
          title: 'Medicine Kit Name',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'total_amount',
          title: 'Total Amount',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            return this._helper.getInINRFormat('INR', data);
          }
        },
        {
          data:'transaction_type',
          title: 'Transaction Type',
          className: 'text-center  font-weight-normal',
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
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-danger btn-sm m-0" refundOrderId=${full.id}> REFUND </button>`;
          }
        }
      ]
    };
  }


  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    /* $(window).on('resize', () => {
      this.rerender();
    }); */
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
      if (event.target.hasAttribute('orderId')) {
        this.goToDetailsPage(event.target.getAttribute('orderId'));
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

  goToDetailsPage(orderId: any): any {
    this.router.navigate(['admin', 'orders', 'view', orderId]);
  }

  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }

  async callProcessrefund(orderId:number){
    this.selectedOrder = this.ordersTableData.find((order:any)=>order.id==orderId);
    if(this.selectedOrder.charged_from_stripe>0 && this.selectedOrder.transaction_type=='AUTHORIZE_AND_CAPTURE'){
      let chargeDetails:any = await this._getPaymentDetailsForOrder(orderId);
      this.selectedOrder.charge_details = chargeDetails &&  chargeDetails.charge_details?chargeDetails.charge_details:null;
    }
    // this.openModal(this.modal);
  }

  async _getPaymentDetailsForOrder(orderId:number){
    const url = `api/v1/new_orders/charge_details/${orderId}`;
    return await this._http.get(url).toPromise();
  }

  openModal(modal:any){
    // let elem=this.document.querySelector('mdb-modal-backdrop');
    // if(elem){elem.remove();}
    modal.show();
  }

  closeModal(modal:any){
    this.selectedOrder = null;
    modal.hide();
  }

}
