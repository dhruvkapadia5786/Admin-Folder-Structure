import { Component, OnInit, ViewChild, Renderer2, AfterViewInit,OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-referral-transactions',
  templateUrl: './referral-transactions.component.html',
  styleUrls: ['./referral-transactions.component.scss']
})
export class ReferralTransactionsComponent implements OnInit, AfterViewInit, OnDestroy {
  referralTransactionsData = new Array();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  dtOptions!: DataTables.Settings;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private _renderer: Renderer2
  ) {
    this.getAllReferralCouponTransactions();
  }

  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';
    $(window).on('resize', () => {
      this.rerender();
    });

  }

  getAllReferralCouponTransactions() {
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
      order: [[7, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/referral-transactions/all',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.referralTransactionsData = resp.data;
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
          data: 'referrer_user_name',
          title: 'Referrer User',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            return `<span userId=${full.referrer_user_id} style="font-weight:bold; cursor:pointer;">${data || 'N/A'}</span>`
          }
        },
        {
          data: 'referree_user_name',
          title: 'Referree User',
          className: 'text-center  font-weight-normal',
          render: (data, type, full) => {
            return `<span userId=${full.referree_user_id} style="font-weight:bold; cursor:pointer;">${data || 'N/A'}</span>`
          }
        },
        {
          data: 'event_type',
          title: 'Category',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            let items:string[]=data.split(',');
            let badgesText='';
            items.forEach((item:any)=>{
                if(item=='ORDER'){
                  badgesText+=`<span class="badge badge-success mr-2">ORDER</span>`
                }else if(item=='CONSULTATION'){
                  badgesText+=`<span class="badge badge-warning mr-2">CONSULTATION</span>`
                }else if(item=='DRUG_ORDER'){
                  badgesText+=`<span class="badge badge-primary mr-2">PHARMACY ORDER</span>`
                }

            })
            return badgesText;
          }
        },
        {
          data: 'referral_code',
          title: 'Referral Code',
          className: 'text-center  font-weight-normal',
        },
        {
          data: 'referrer_user_reward',
          title: 'Referrer Reward',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data > 0) {
              return '<span>' + '₹'+ data + '</span>'
            } else {
              return '<span> - </span>';
            }
          }
        },
        {
          data: 'referree_user_reward',
          title: 'Referree Reward',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data > 0) {
              return '<span>' + '₹'+ data + '</span>'
            } else {
              return '<span> - </span>';
            }
          }
        },
        {
          data: 'redeemed_at',
          title: 'Redeemed At',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getLocalDate(data, 'MM/DD/YYYY');
            } else {
              return '<span>-</span>';
            }
          }
        },
        {
          data: 'used_at',
          title: 'Used At',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getLocalDate(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            let items:string[]=full.event_type.split(',');
            let btnText='';
            items.forEach((item:any)=>{
                if(item=='ORDER'){
                  btnText+=`<button class="btn btn-default btn-sm m-0" orderId=${full.event_id}>View</button>`
                }else if(item=='CONSULTATION'){
                  btnText+=`<button class="btn btn-default btn-sm m-0" consultationId=${full.event_id}>View</button>`
                }else if(item=='DRUG_ORDER'){
                  btnText+=`<button class="btn btn-default btn-sm m-0" pharmacyOrderId=${full.event_id}>View</button>`
                }
                else{
                  btnText=''
                }
            })
            return btnText;
          },
          orderable: false
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
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('userId')) {
        this.goToUserDetailsPage(event.target.getAttribute('userId'));
      }
      if (event.target.hasAttribute('orderId')) {
        this.goToOrderDetailPage(event.target.getAttribute('orderId'));
      }
      if (event.target.hasAttribute('consultationId')) {
        this.goToConsultationDetailPage(event.target.getAttribute('consultationId'));
      }
      if (event.target.hasAttribute('pharmacyOrderId')) {
        this.goToDrugOrderDetailPage(event.target.getAttribute('pharmacyOrderId'));
      }

    });
  }

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		if(this.dtTrigger){
			this.dtTrigger.unsubscribe();
    }
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
      });
    }
    if(this.blockDataTable){this.blockDataTable.unsubscribe();}
    this.listenerFn();
	}


  goToUserDetailsPage(userId: any): any {
    this.router.navigate(['admin', 'patients', 'view', userId, 'info']);
  }
  goToOrderDetailPage(orderId: any): any {
    this.router.navigate(['admin', 'orders', 'view', orderId]);
  }
  goToConsultationDetailPage(consultationId: any): any {
    this.router.navigate(['admin', 'consultation', 'view', consultationId]);
  }
  goToDrugOrderDetailPage(pharmacyOrderId: any): any {
    this.router.navigate(['admin', 'drug-order', 'view', pharmacyOrderId]);
  }

}
