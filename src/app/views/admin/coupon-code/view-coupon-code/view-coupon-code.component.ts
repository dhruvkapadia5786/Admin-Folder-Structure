import { Component, OnInit, ChangeDetectorRef ,ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Helper } from 'src/app/services/helper.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-coupon-code',
  templateUrl: './view-coupon-code.component.html',
  styleUrls: ['./view-coupon-code.component.scss']
})
export class ViewCouponCodeComponent implements OnInit {

  public couponCodeDetails: any = {};
  public couponCodeId;

  doctorTableData = new Array();
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  consultationTableData = new Array();
  consultationdtOptions!: DataTables.Settings;


  constructor(public http: HttpClient,
    private route: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    public _helper: Helper,
    private _http: HttpClient,
    private router: Router,
    private _renderer: Renderer2
  ) {
    this.couponCodeId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getCouponCodeDetails();
    this.getCouponCodeHistory();
    this.getConsultationCouponCodeHistory();


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
    this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('orderId')) {
        this.goToDetailsPage(event.target.getAttribute('orderId'), 'orders');
      }
      if (event.target.hasAttribute('consultationId')) {
        this.goToDetailsPage(event.target.getAttribute('consultationId'), 'consultation');
      }
      if (event.target.hasAttribute('customerId')) {
        this.goToPatientDetails(event.target.getAttribute('customerId'));
      }
    });
  }

  goToDetailsPage(eventId: any, page: any): any {
    this.router.navigate(['admin', page, 'view', eventId]);
  }

  goToPatientDetails(customeId: any): any {
    this.router.navigate(['admin', 'patients', 'view', customeId, 'orders']);
  }

  getCouponCodeDetails() {
    console.log('this.couponCodeId >>> ', this.couponCodeId)
    const url = 'api/coupon_codes/view/' + this.couponCodeId;
    this.http.get(url)
      .subscribe((couponCode: any) => {
        console.log('couponCode >> ', couponCode)
        this.couponCodeDetails = couponCode;
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

  getCouponCodeHistory() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      search: false,
      searching: false,
      autoWidth: true,
      ordering: true,
      order: [[5, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/coupan-code/history/'+this.couponCodeId,
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.doctorTableData = resp.data;
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
          data: 'user_name',
          title: 'Patient Name',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            return `<a href="javascript:void(0);" class="text-primary" customerId=${full.user_id}>${data}</a>`;
          }
        },
        {
          data: 'order_number',
          title: 'Order Number',
          className: 'text-center',
          render: function (data, type, record) {
              return '<a href="javascript:void(0);" orderID=' + record.order_id + ' class="link">' + data + '</a>';
          }
        },
        {
          data: 'medicine_kit_name',
          title: 'Medicine Kit Name',
          className: 'text-center',
        },
        {
          data: 'kit_sell_price',
          title: 'Kit Price',
          className: 'text-center',
          render: (data) => {
            return '<span>' + '$'+ data + '</span>'
          }
        },
        {
          data: 'discount_got',
          title: 'Discount Got',
          className: 'text-center',
          render: (data) => {
            return '<span>' + '$'+ data + '</span>'
          }
        },
        {
          data: 'created',
          title: 'Coupon Used At',
          className: 'text-center',
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

  getConsultationCouponCodeHistory() {
    this.consultationdtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      search: false,
      searching: false,
      autoWidth: true,
      ordering: true,
      order: [[5, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/coupan-code/consultation/history/'+this.couponCodeId,
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
          });
      },
      columns: [
        {
          data: 'user_name',
          title: 'Patient Name',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            return `<a href="javascript:void(0);" class="text-primary" customerId=${full.user_id}>${data}</a>`;
          }
        },
        {
          data: 'consultation_number',
          title: 'Consultation Number',
          className: 'text-center',
          render: function (data, type, record) {
              return '<a href="javascript:void(0);" consultationId=' + record.event_id + ' class="link">' + data + '</a>';
          }
        },
        {
          data: 'name',
          title: 'Health Condition Name',
          className: 'text-center',
        },
        {
          data: 'retail_cost',
          title: 'Consultation Charge',
          className: 'text-center',
          render: (data) => {
            return '<span>' + '$'+ data + '</span>'
          }
        },
        {
          data: 'coupon_discount',
          title: 'Discount Got',
          className: 'text-center',
          render: (data) => {
            return '<span>' + '$'+ data + '</span>'
          }
        },
        {
          data: 'used_at',
          title: 'Coupon Used At',
          className: 'text-center',
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

}
