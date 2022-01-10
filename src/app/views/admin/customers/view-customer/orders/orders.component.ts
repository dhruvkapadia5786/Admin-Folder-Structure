import { Component, OnInit, Renderer2, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { DataTableDirective } from 'angular-datatables';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { orderHelper } from 'src/app/services/orderHelper.service';

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
    public _orderHelper:orderHelper,
    private router: Router,
    private _renderer: Renderer2){
      this.getDTOptions();
    }

  ngOnInit(){
    let activeRoute:any=this.route;
    this.parentSub = activeRoute.parent.parent.params.subscribe((params:any) => {
      this.customerId = params['id'];
    });

    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getDTOptions() {
    let that=this;
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
        dataTablesParameters.filter = {};
        dataTablesParameters.filter.CUSTOMER_ID = this.customerId;

        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/orders/list',
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
              return `<a href="javascript:void(0);" orderDetailsID="${record._id}">${data}</a>`;
            } else {
              return '<span></span>';
            }
          }
        },
        { data: 'medicine_kit_details.name', title: 'Medicine Kit' },
        {
          data: 'total_amount',
          title: 'Total Amount',
          className: 'text-right',
          render: function (data){
            return that._helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'system_status',
          title: 'Order Status',
          className: 'text-center',
          render: function (data,type,full){
            return that._orderHelper.getSystemStatus(data);
          }
        },
        {
          data: 'created_at',
          title: 'Order Date',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'DD-MM-YYYY');
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
