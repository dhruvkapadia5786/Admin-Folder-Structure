import { Component, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '../../../../services/helper.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-refund-processed-orders',
  templateUrl: './refund-processed-orders.component.html',
  styleUrls: ['./refund-processed-orders.component.scss']
})
export class RefundProcessedOrdersComponent implements OnInit,AfterViewInit {

  ordersTableData:any[]=[];
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
            `api/orders/refund_processed`,
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
          data: 'order_refund_reason',
          title: 'Reason',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'refund_id',
          title: 'Stripe Refund Id',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return data? `<a target="_blank" href="https://dashboard.stripe.com/payments/${full.charge_id}">${data}</a>`:'-';
          }
        },
        {
          data: 'order_refund_processed_on',
          title: 'Processed On',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'DD-MM-YYYY');
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('orderId')) {
        this.goToDetailsPage(event.target.getAttribute('orderId'));
      }
      if (event.target.hasAttribute('customerId')) {
        this.goToPatientDetails(event.target.getAttribute('customerId'));
      }
    });
  }

  goToDetailsPage(orderId: any): any {
    this.router.navigate(['admin', 'orders', 'view', orderId]);
  }
  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }

}
