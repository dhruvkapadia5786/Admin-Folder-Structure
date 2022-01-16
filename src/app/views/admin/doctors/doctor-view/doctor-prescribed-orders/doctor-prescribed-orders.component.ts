import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { orderHelper } from 'src/app/services/orderHelper.service';

@Component({
  selector: 'app-doctor-prescribed-orders',
  templateUrl: './doctor-prescribed-orders.component.html',
  styleUrls: ['./doctor-prescribed-orders.component.scss']
})
export class DoctorPrescribedOrdersComponent implements OnInit, AfterViewInit {
  doctorId!: number;
  dtOptions!: DataTables.Settings;
  prescribedOrdersData: any;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  prescribedOrders!: DataTables.Settings;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private http: HttpClient,
    public helper: Helper,
    public _orderHelper:orderHelper,
    private router: Router,
    private _renderer: Renderer2,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.doctorId = this.route.snapshot.params.id;
    this.getPrescribedOrders();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getPrescribedOrders() {
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
        dataTablesParameters.filter.DOCTOR_STATUS = ['PRESCRIBED'];
        this.http
          .post<any>(
            'api/orders/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.prescribedOrdersData = resp.data;
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
          title: 'Order #',
          render: function (data, type, record) {
            if (data) {
              return '<a href="javascript:void(0);" orderID=' + record._id + '>' + data + '</a>';
            } else {
              return '<span></span>';
            }
          }
        },
        {
          title: 'Patient Name',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            // tslint:disable-next-line:max-line-length
            return `<a href="javascript:void(0);" customerId=${full.user_id}>${full.user.first_name} ${full.user.last_name} </a>`;
          }
        },
        {
          data: 'user.date_of_birth',
          title: 'Age',
          render: function (data){
            if (data) {
              return moment().diff(data, 'years');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          title: 'Medicine Kit',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            // tslint:disable-next-line:max-line-length
            return `<a href="javascript:void(0);" medicineKitId=${full.medicine_kit_id}>${full.medicine_kit_details.name}</a>`;
          }
        },
        {
          data:'total_amount',
          title:'Total',
          className: 'text-center',
          render: function (data: any) {
            const _helper = new Helper();
            return _helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'doctor_status',
          title: 'Order Status',
          className: 'text-center',
          render: function (data) {
            return that._orderHelper.getDoctorStatus(data);
          }
        },
        {
          data: 'order_place_datetime',
          title: 'Order Date',
          render: (data) => {
            if (data) {
              return this.helper.getFormattedDate(data, 'DD-MM-YYYY hh:mm A');
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
    this._renderer.listen('document', 'click', (event: any) => {
      if (event.target.hasAttribute('orderID')) {
        this.goToOrderPage(event.target.getAttribute('orderID'));
      }
      if (event.target.hasAttribute('customerId')) {
        this.goToPatientDetails(event.target.getAttribute('customerId'));
      }
      if (event.target.hasAttribute('medicineKitId')) {
        this.goToMedicineKitDetails(event.target.getAttribute('medicineKitId'));
      }
    });
    this.rerender();
  }
  goToOrderPage(orderID: any): any {
    this.router.navigate(['admin', 'orders', 'view', orderID]);
  }
  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }
  goToMedicineKitDetails(medicineKitId: any): any {
    this.router.navigate(['admin', 'medicine-kits', 'view', medicineKitId]);
  }

}
