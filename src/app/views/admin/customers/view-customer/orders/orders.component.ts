import { Component, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Helper } from '../../../../../services/helper.service';
import { CUSTOMER_STATUS } from 'src/app/enums/order-status.enum';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit {

  public listOfOrders: any[] = [];
  public customerId: any;
  public parentSub: any;
  ordersTableData = new Array<Order>();
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

  getAllOrders() {
  }
  getDTOptions() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      search: false,
      searching: false,
      autoWidth: true,
      ordering: true,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/orders/forCustomer/' + this.customerId,
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
          className: 'text-right',
          render: function (data, type, record) {
            if (data) {
              return `<a href="javascript:void(0);" orderDetailsID="${record.id}">${data}</a>`;
            } else {
              return '<span></span>';
            }
          }
        },
        { data: 'medicine_kit_name', title: 'Medicine Kit' },
        { data: 'quantity', title: 'Quantity', className: 'text-right' },
        {
          data: 'total_amount',
          title: 'Total Amount',
          className: 'text-right',
          render: function (data) {
            let _helper = new Helper();
            return _helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'customer_status',
          title: 'Order Status',
          className: 'text-center',
          render: function (data,type,full) {
            let badge='';
            if (data == 1 || data==2) {
              badge= `<span class='badge badge-info'>${CUSTOMER_STATUS[data]}</span>`;
            }
            else if (data == 3) {
              badge= `<span class='badge badge-warning'>${CUSTOMER_STATUS[data]}</span>`;
            } else if (data == 4) {
              badge= `<span class='badge badge-success'>${CUSTOMER_STATUS[data]}</span>`;
            } else if (data == 5) {
              badge= `<span class='badge badge-info'>${CUSTOMER_STATUS[data]}</span>`;
            } else if (data == 6) {
              badge= `<span class='badge badge-success'>${CUSTOMER_STATUS[data]}</span>`;
            } else if (data == 7) {
              badge= `<span class='badge badge-danger'>${CUSTOMER_STATUS[data]}</span>`;
            } else if (data == 8) {
              badge= `<span class='badge badge-danger'>${CUSTOMER_STATUS[data]}</span>`;
            } else if (data == 9) {
              badge= `<span class='badge badge-success'>${CUSTOMER_STATUS[data]}</span>`;
            } else {
              badge= '<span></span>';
            }
            if(full.is_transferred==1){
              badge+= `<span class='badge badge-warning'>Transferred</span>`;
            }
            return badge;
          }
        },
        {
          data: 'tracking_id', title: 'Tracking ID',
          render: function (data: any, type: any, full: any) {
            if (full.customer_status > 3 && full.customer_status != 5 && full.customer_status != 8 && full.customer_status != 9) {
              return `<a target="_blank" href="${full.tracking_url}">${full.tracking_id}</a>`
            }
            else {
              return '<span></span>'
            }
          }
        },
        {
          data: 'created',
          title: 'Order Date',
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
    this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('orderDetailsID')) {
        this.goToOrderDetailsPage(event.target.getAttribute('orderDetailsID'));
      }
    });
  }

  goToOrderDetailsPage(orderId: any): any {
    this.router.navigate(['admin', 'orders', 'view', orderId]);
  }

}
