import { Component, OnInit, ViewEncapsulation, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '../../../../services/helper.service';
import { HttpClient } from '@angular/common/http';
import { SYSTEM_STATUS } from '../../../../enums/order-status.enum';
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
      ORDER_STATUS: '1,2,3,4,5,6,7,8,9,10,15,16,17',
      ORDER_TYPE: 'ALL'
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

    this.medicineKitId = this.route?.parent?.parent?.snapshot.paramMap.get('kit_id') ? parseInt(this.route.parent.parent.snapshot.paramMap.get('kit_id')!) : null;
    this.treatmentConditionId = this.route?.parent?.parent?.snapshot.paramMap.get('treatment_id');

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
      pageLength: 20,
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
              return '<a href="javascript:void(0);" orderID=' + record.id + ' class="text-primary font-weight-bold">' + data + '</a>';
            } else {
              return '<span></span>';
            }
          }
        },{
          data: 'created',
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
          data: 'customer_first_name',
          title: 'Customer Name',
          className: 'text-center font-weight-normal',
          render: function (data: any, type: any, full: any) {
            // tslint:disable-next-line:max-line-length
            return `<a href="javascript:void(0);" class="text-primary font-weight-bold" customerId=${full.tele_daddy_user_id}>${full.customer_first_name} ${full.customer_last_name} </a>`;
          }
        },
        {
          data: 'medicine_kit_name',
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
          data: 'state_name',
          title: 'State',
          className: 'text-center font-weight-normal'
        },
        {
          data: 'system_status',
          title: 'System Status',
          className: 'text-center font-weight-normal',
          render: (data,type,record) => {
            return this.getSystemStatus(data,type,record);
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
  getSystemStatus(data:any,type:any,record:any) {
    let systemStatusBadge='';
    switch (data) {
      case 0:
      case null:
        systemStatusBadge= `<span class='badge badge-default'>Incomplete</span>`;
        break;
      case 1:
        systemStatusBadge= `<span class='badge badge-info'>${SYSTEM_STATUS[data]}</span>`;
        break;
      case 2:
      case 4:
      case 5:
      case 6:
      case 9:
      case 10:
      case 11:
      case 17:
        systemStatusBadge= `<span class='badge badge-success'>${SYSTEM_STATUS[data]}</span>`;
        break;
      case 3:
      case 13:
      case 14:
      case 15:
        systemStatusBadge= `<span class='badge badge-danger'>${SYSTEM_STATUS[data]}</span>`;
        break;
      case 7:
      case 8:
      case 12:
      case 16:
        systemStatusBadge= `<span class='badge badge-warning'>${SYSTEM_STATUS[data]}</span>`;
        break;
      default:
        systemStatusBadge= `<span></span>`;
    }
    if(record.is_transferred==1){
        systemStatusBadge+=`<span class='badge badge-warning'>Transferred</span>`;
    }
    if(record.is_closed==1){
      systemStatusBadge+=`<span class='badge badge-dark'>Closed</span>`;
    }
    return systemStatusBadge;
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
    return this.stateList.filter(({ id: a }) => !this.order_config.filter.STATE.some((b: any) => b === a)).length;
  }

  get notSelectedMedicineKit () {
    return this.medicinekitList.filter(({ id: a }) => !this.order_config.filter.MEDICINE_KIT.some((b: any) => b === a)).length;
  }

  getAllFilterList() {
    // states
    this._http.get<any>('api/system_states/all').subscribe((resp) => {
      this.stateList = resp;
    }, err=> {});

    // Medicine kits
    this._http.post<any>('api/v1/admin/medicinekits/all', {}).subscribe((resp) => {
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
        this.order_config.filter.STATE = this.stateList.map(({id}) => id);
      } else {
        this.order_config.filter.STATE = [];
      }
    }
    if (flag == 'MK') {
      if (event.checked) {
        this.order_config.filter.MEDICINE_KIT = this.medicinekitList.map(({id}) => id);
      } else {
        this.order_config.filter.MEDICINE_KIT = [];
      }
    }
    $('#ordersList').DataTable().ajax.reload();
  }

  clearFilter() {
    this.order_config = {filter: {STATE: [], MEDICINE_KIT: [], ORDER_STATUS: '1,2,3,4,5,6,7,8,9,10,15,16,17', ORDER_TYPE: 'ALL'}}
    if (this.medicineKitId && this.treatmentConditionId) {
      this.order_config.filter.MEDICINE_KIT.push(this.medicineKitId);
    }
    $('#ordersList').DataTable().ajax.reload();
  }

}
