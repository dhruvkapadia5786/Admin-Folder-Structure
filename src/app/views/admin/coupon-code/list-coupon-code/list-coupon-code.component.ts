import { Component, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import * as moment from 'moment';
import { Toastr } from 'src/app/services/toastr.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfirmDeleteCouponModalComponent } from '../confirm-delete-coupon-modal/confirm-delete-coupon-modal.component';
import { BulkEditCouponModalComponent } from '../bulk-edit-coupon-modal/bulk-edit-coupon-modal.component';

@Component({
  selector: 'app-list-coupon-code',
  templateUrl: './list-coupon-code.component.html',
  styleUrls: ['./list-coupon-code.component.scss']
})
export class ListCouponCodeComponent implements OnInit, AfterViewInit {
  modalRef!: BsModalRef;
  doctorTableData = new Array();
  dtOptions: any;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  couponcode_config:any = {
    filter: {
      STATUS: '',
      CATEGORY: '',
      COUPON_TYPE: '',
      dateRangeField: 'expiry',
      dateRange: []
    }
  };

  couponCodeStatusList:any[] = [
    {name: "ALL", id:''},
    {name: "USED", id:'USED'},
    {name: "UNUSED", id:'UNUSED'},
    {name: "ACTIVE", id:'ACTIVE'},
    {name: "INACTIVE", id:'INACTIVE'},
    {name: "DELETED", id:'DELETED'},
    {name: "EXPIRED", id:'EXPIRED'},
    {name: "ONLY GROUPON", id:'ONLY_GROUPON'},
    {name: "CUSTOM", id:'NOT_GROUPON'}
  ];

  ranges: any = {
    'Today': [moment(), moment()],
    'Tomorrow': [moment().add(1, 'days'), moment().add(1, 'days')],
    'Next 7 Days': [moment(), moment().add(6, 'days')],
    'Next 15 Days': [moment(), moment().add(15,'days')],
    'Next 30 Days': [moment(), moment().add(29, 'days')],
    'Next 60 Days': [moment(), moment().add(60, 'days')],
    'Next 90 Days': [moment(), moment().add(90, 'days')],
    'Next Month': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')]
  };

  selectedCouponCodeIds: any;

  public is_change_amount_flag = false;

  recordsCount!:number;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private _toastr: Toastr,
    private _renderer: Renderer2,
    private modalService: BsModalService
  ) {
    this.getAllCouponCodes();
  }

  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });
  }

  getSelectedCouponCodes (modal: string) {
    let couponIds: any;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        couponIds = dtInstance.rows({ selected: true }).data();
        return couponIds;
      }).then((data:any) => {
        if (couponIds.length > 0) {
          this.selectedCouponCodeIds = couponIds.toArray().map((coupon:any)=>coupon._id);

          if(modal == 'DELETE') {
            this.modalRef = this.modalService.show(ConfirmDeleteCouponModalComponent)
            this.modalRef.content.onEventCompleted.subscribe((event: string) => {
              if (event == 'DELETE') {
                this.deleteSelectedCouponCode()
              }
            });
          } else if(modal == 'EDIT') {
            this.modalRef = this.modalService.show(BulkEditCouponModalComponent, {class: 'modal-x-lg'})
            this.modalRef.content.onEventCompleted.subscribe((validForm: any) => {
              this.is_change_amount_flag = validForm.is_change_amount
              this.updateCouponCode(validForm)
            });
          }
        } else {
          this._toastr.showWarning('Please select atleast one coupon.');
        }
      });
  }

  deleteSelectedCouponCode() {
    this._http
    .post<any>(
      'api/coupon_codes/bulk-soft-delete',
      {'couponIds': this.selectedCouponCodeIds}
    )
    .subscribe((resp) => {
      this._toastr.showSuccess("Coupon Codes Delete Successfully.")
      this.rerender();
    }, err => {
      this._toastr.showError("Unable to delete coupon codes.")
    });
  }

  updateCouponCode(bulkUpdateCouponCode: any){
    let dataToBeUpdate: any = {
      is_change_amount_flag: this.is_change_amount_flag
    };
    dataToBeUpdate.couponIds = this.selectedCouponCodeIds
    dataToBeUpdate.expiry = moment.tz(bulkUpdateCouponCode.expiry, 'Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss');
    dataToBeUpdate.is_active = bulkUpdateCouponCode.is_active;

    if (this.is_change_amount_flag) {
      dataToBeUpdate.discount_amount = (bulkUpdateCouponCode.discount_amount) ? bulkUpdateCouponCode.discount_amount : 0;
      dataToBeUpdate.discount_percent = (bulkUpdateCouponCode.discount_percent) ? bulkUpdateCouponCode.discount_percent : 0;
    }

    const url = 'api/coupon_codes/bulk-update';
    const req = dataToBeUpdate;
    this._http.post(url, req).subscribe((data: any) => {
      this.selectedCouponCodeIds = null;
      this.rerender();
      this._toastr.showSuccess('Update Successfully');
    },
    err => {
      this.selectedCouponCodeIds = null;
      this._toastr.showError('Unable to Update Coupon Code');
    });
  }

  getAllCouponCodes() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      // processing: true,
      search: true,
      searching: true,
      autoWidth: true,
      select: true,
      ordering: true,
      order: [[7, 'desc']],
      ajax: (dataTablesParameters: any, callback: any) => {
        /* set manual filters in req body */
        dataTablesParameters.filter = {};
        dataTablesParameters.filter.STATUS = this.couponcode_config.filter.STATUS != '' ? this.couponcode_config.filter.STATUS : undefined;
        dataTablesParameters.filter.CATEGORY = this.couponcode_config.filter.CATEGORY != '' ? this.couponcode_config.filter.CATEGORY : undefined;
        dataTablesParameters.filter.COUPON_TYPE = this.couponcode_config.filter.COUPON_TYPE != '' ? this.couponcode_config.filter.COUPON_TYPE : undefined;
        dataTablesParameters.filter.dateRangeField = this.couponcode_config.filter.dateRangeField
        dataTablesParameters.filter.dateRange = this.couponcode_config.filter.dateRange.length > 0 ? this.couponcode_config.filter.dateRange : undefined;

        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/coupon_codes/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.doctorTableData = resp.data;
            this.blockDataTable.stop();
            this.recordsCount =  resp.recordsTotal;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          });
      },
      columns: [
        { className: 'select-checkbox', orderable: false },
        {
          data: 'coupon_category',
          title: 'Category',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            let badgesText='';
            data.forEach((item:any)=>{
                if(item=='DTC_ORDER'){
                  badgesText+=`<span class="badge badge-success mr-2">ORDER</span>`
                }
                else if(item=='CONSULTATION'){
                  badgesText+=`<span class="badge badge-warning mr-2">CONSULTATION</span>`
                }else if(item=='PHARMACY_ORDER'){
                  badgesText+=`<span class="badge badge-primary mr-2">PHARMACY ORDER</span>`
                }else{

                }
            })
            return badgesText;
          }
        },
        {
          data: 'coupon_type',
          title: 'Coupon Type',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data =='REGULAR') {
              return '<span class="badge badge-primary">' + data + '</span>'
            } else {
              return '<span class="badge badge-success">' + data + '</span>';
            }
          }
        },
        {
          data: 'coupon_code',
          title: 'Coupon Code',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'coupon_name',
          title: 'Coupon Name',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'discount_amount',
          title: 'Discount Amount',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data > 0) {
              return '<span>' + '₹'+ data + '</span>'
            } else {
              return '<span> - </span>';
            }
          }
        },
        {
          data: 'discount_percent',
          title: 'Discount Percent',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data > 0) {
              return '<span>' + data + '% </span>'
            } else {
              return '<span> - </span>';
            }
          }
        },
        {
          data: 'use_count',
          title: 'Use Count',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'created_at',
          title: 'Created',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data) {
              return this._helper.getFormattedDateFromUnixTimestamp(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'expiry',
          title: 'Expiry',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-default btn-sm m-0" couponCodeID=${full._id}>View</button>
              <button class="btn btn-sm btn-primary mt-2" couponCodeEditID=${full._id}>Edit</button>`;
          },
          orderable: false
        },
        {
          data: 'deleted_at',
          title: 'Deleted',
          className: 'text-center  font-weight-normal',
          render: (data:any) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'MM/DD/YYYY');
            } else {
              return '<span> - </span>';
            }
          }
        },
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
      if (event.target.hasAttribute('couponCodeID')) {
        this.goToDetailsPage(event.target.getAttribute('couponCodeID'));
      }
      if (event.target.hasAttribute('couponCodeEditID')) {
        this.goToEditPage(event.target.getAttribute('couponCodeEditID'));
      }
    });
  }

  goToDetailsPage(couponCodeID: any): any {
    this.router.navigate(['admin', 'coupon-code', 'view-coupon-code', couponCodeID]);
  }

  goToEditPage(couponCodeEditID: any): any {
    this.router.navigate(['admin', 'coupon-code', 'edit-coupon-code', couponCodeEditID]);
  }

  handleChange(event: string, value: any) {
    if((event == 'STATUS') || event == 'CATEGORY'  || event == 'TYPE') {
      this.rerender()
    }
  }

  setDateRangeFilter(dateRange: any): void {
    this.couponcode_config.filter.dateRange = [moment(dateRange.start).tz('Asia/Calcutta').format('YYYY-MM-DD'), moment(dateRange.end).tz('Asia/Calcutta').format('YYYY-MM-DD')]
    this.rerender();
  }

  clearFilter(){
    this.couponcode_config = {
      filter: {
        STATUS: '',
        CATEGORY: '',
        COUPON_TYPE: '',
        dateRangeField: 'expiry',
        dateRange: []
      }
    };
    // this.pickerDirective.clear();
    $('#coupanCodeList').DataTable().ajax.reload();
  }

}
