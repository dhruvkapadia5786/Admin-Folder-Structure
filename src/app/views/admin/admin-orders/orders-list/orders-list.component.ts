import { Component, OnInit, ViewEncapsulation, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '../../../../services/helper.service';
import { HttpClient } from '@angular/common/http';
import { orderHelper } from 'src/app/services/orderHelper.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrdersListComponent implements OnInit, AfterViewInit,OnDestroy {

  ordersTableData = [];
  order_config:any = {
    filter: {
      STATE: [],
      MEDICINE_KIT: [],
      ORDER_STATUS: ['NONE','ASSIGNED_TO_TECHNICIAN','REJECTED','APPROVED_BY_TECHNICIAN','ASSIGNED_TO_DOCTOR','PRESCRIBED_BY_DOCTOR','REFUND_REQUESTED','REFUND_PROCESSED','ASSIGNED_TO_PHARMACY','COMPLETED','TOO_SOON'],
      ORDER_TYPE: ['MAIN','REFILL']
    }
  };
  stateList:any[] = [];
  medicinekitList: any[] = [];

  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  medicineKitId!: any;
  treatmentConditionId: any;
  showHeaderAndFilter: boolean = true;
  disableMedicineKitSelect: boolean = false;

  constructor(private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private _renderer: Renderer2,
    private _orderHelper:orderHelper) {

    let activeRoute:any=this.route;

    this.medicineKitId = activeRoute.parent.parent.snapshot.paramMap.get('kit_id');
    this.treatmentConditionId = activeRoute.parent.parent.snapshot.paramMap.get('treatment_id');

    if (this.medicineKitId && this.treatmentConditionId) {
      this.showHeaderAndFilter = false
      this.disableMedicineKitSelect = true
      this.order_config.filter.MEDICINE_KIT.push(this.medicineKitId);
    }
  }

  ngOnInit() {
    this.getAllFilterList();
    this.getDTOptions();
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getDTOptions() {
    var that=this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      paging: true,
      serverSide: true,
      // processing: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[2, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
          /* set manual filters in req body */
          dataTablesParameters.filter = {};
          dataTablesParameters.filter.STATE = this.order_config.filter.STATE.length > 0 ? this.order_config.filter.STATE : undefined;
          dataTablesParameters.filter.MEDICINE_KIT = this.order_config.filter.MEDICINE_KIT.length > 0 ? this.order_config.filter.MEDICINE_KIT : undefined;
          dataTablesParameters.filter.ORDER_STATUS = this.order_config.filter.ORDER_STATUS != '' ? this.order_config.filter.ORDER_STATUS : undefined;
          dataTablesParameters.filter.ORDER_TYPE = this.order_config.filter.ORDER_TYPE != '' ? this.order_config.filter.ORDER_TYPE : undefined;

        this.blockDataTable.start();
        this._http
          .post<any>(
            `api/orders/list`,
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
          className: 'text-center font-weight-normal',
          render: function (data, type, record) {
            if (data) {
              return '<a href="javascript:void(0);" orderID=' + record._id + ' class="text-primary font-weight-bold">' + data + '</a>';
            } else {
              return '<span></span>';
            }
          }
        },{
          data: 'created_at',
          title: 'Order Date',
          className: 'text-center font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'DD-MM-YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'order_place_datetime',
          title: 'Completed On',
          className: 'text-center font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'DD-MM-YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'user_id.first_name',
          title: 'Customer Name',
          className: 'text-center font-weight-normal',
          render: function (data: any, type: any, full: any) {
            // tslint:disable-next-line:max-line-length
            return `<a href="javascript:void(0);" class="text-primary font-weight-bold" customerId=${full.user_id._id}>${full.user_id.first_name} ${full.user_id.last_name} </a>`;
          }
        },
        {
          data: 'medicine_kit_details.name',
          title: 'Medicine Kit Name',
          className: 'text-center font-weight-normal'
        },
        {
          data: 'total_amount',
          title: 'Total Amount',
          className: 'text-center font-weight-normal',
          render: (data) => {
            return this._helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'shipping_address',
          title: 'State',
          className: 'text-center font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `${full.shipping_address.state}`;
          }
        },
        {
          data: 'system_status',
          title: 'System Status',
          className: 'text-center font-weight-normal',
          render: (data) => {
            return  that._orderHelper.getSystemStatus(data);
          }
        },
        {
          data: 'order_type',
          title: 'Order Type',
          className: 'text-center font-weight-normal',
          render: (data) => {
            return that._orderHelper.getOrderType(data);
          }
        },
        {
          data: 'created_by',
          title: 'Created',
          className: 'text-center font-weight-normal',
          render: (data) => {
            return that._orderHelper.getOrderCreatedWay(data);
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

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('orderId')) {
        this.goToDetailsPage(event.target.getAttribute('orderId'));
      }
      if (event.target.hasAttribute('customerId')) {
        this.goToPatientDetails(event.target.getAttribute('customerId'));
      }
    });
  }

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		if(this.dtTrigger){
			this.dtTrigger.unsubscribe();
    }
    if(this.blockDataTable){this.blockDataTable.unsubscribe();}
    this.listenerFn();
	}

  goToDetailsPage(orderId: any): any {
    this.router.navigate(['admin', 'orders', 'view', orderId]);
  }
  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }


  get notSelectedStates () {
    return this.stateList ? this.stateList.filter(({ _id: a }) => !this.order_config.filter.STATE.some((b: any) => b === a)).length:0;
  }

  get notSelectedMedicineKit () {
    return this.medicinekitList ? this.medicinekitList.filter(({ _id: a }) => !this.order_config.filter.MEDICINE_KIT.some((b: any) => b === a)).length:0;
  }

  getAllFilterList() {
    // states
    this._http.get<any>('api/system_states/all').subscribe((resp) => {
      this.stateList = resp;
    }, err=> {});

    // Medicine kits
    this._http.get<any>('api/medicine_kits/all').subscribe((resp) => {
      this.medicinekitList = resp.data;
    }, err=> {});
  }

  handleChange(event: string, value: any) {
    $('#ordersList').DataTable().ajax.reload();
  }

  /* Handle Check all */
  public handleCheckAll (event:any, flag:any) {
    if (flag == 'STATE') {
      if (event.checked) {
        this.order_config.filter.STATE = this.stateList.map(({_id}) => _id);
      } else {
        this.order_config.filter.STATE = [];
      }
    }
    if (flag == 'MK') {
      if (event.checked) {
        this.order_config.filter.MEDICINE_KIT = this.medicinekitList.map(({_id}) => _id);
      } else {
        this.order_config.filter.MEDICINE_KIT = [];
      }
    }
    $('#ordersList').DataTable().ajax.reload();
  }

  clearFilter() {
    this.order_config = {filter: {STATE: [], MEDICINE_KIT: [], ORDER_STATUS:['NONE','ASSIGNED_TO_TECHNICIAN','REJECTED','APPROVED_BY_TECHNICIAN','ASSIGNED_TO_DOCTOR','PRESCRIBED_BY_DOCTOR','REFUND_REQUESTED','REFUND_PROCESSED','ASSIGNED_TO_PHARMACY','COMPLETED','TOO_SOON'], ORDER_TYPE: ['MAIN','REFILL']}}
    if (this.medicineKitId && this.treatmentConditionId) {
      this.order_config.filter.MEDICINE_KIT.push(this.medicineKitId);
    }
    $('#ordersList').DataTable().ajax.reload();
  }

}
