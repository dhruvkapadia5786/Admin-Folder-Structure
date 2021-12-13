import { Component, OnInit, Renderer2,ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-customer-wallet',
  templateUrl: './customer-wallet.component.html',
  styleUrls: ['./customer-wallet.component.scss']
})
export class CustomerWalletComponent implements OnInit,AfterViewInit, OnDestroy {

  public customerId: any;
  public parentSub: any;

  walletTransactionsTableData = new Array<any>();
  totalTransactions:number=0;
  dtOptions!: DataTables.Settings;
  wallet:any;
  wallet_amount:number=0;

  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;

  dtTrigger: Subject<any> = new Subject();

  constructor(private _http: HttpClient,
		private _toastr: Toastr,
		private _renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute,
		public _helper: Helper,
		public _changeDetectorRef: ChangeDetectorRef) {

      let activeRoute:any = this.route;
      if(activeRoute){
        this.parentSub = activeRoute.parent.parent.params.subscribe((params:any) => {
          this.customerId = params['id'];
          this.getDTOptions();
        });
      }


    }

    ngOnInit() {
      $.fn.dataTable.ext.errMode = 'none';
      $(window).on('resize', () => {
        this.rerender();
      });
    }

    getDTOptions(){
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
          this.blockDataTable.start();
          this._http
            .post<any>(
              `api/customer/wallet_transactions/${this.customerId}`,
              dataTablesParameters,
              {}
            )
            .subscribe((resp) => {
              this.wallet = resp.wallet;
              this.walletTransactionsTableData = resp.transactions.data;
              this.totalTransactions = resp.transactions.recordsTotal;
              this.blockDataTable.stop();
              callback({
                recordsTotal: resp.transactions.recordsTotal,
                recordsFiltered: resp.transactions.recordsFiltered,
                data: resp.transactions.data
              });
              this._changeDetectorRef.detectChanges();
            });
        },
        columns: [
          {
            data: 'transaction_date',
            title: 'Date',
            className: 'text-center',
            render: function (data) {
              return that._helper.getFormattedDate(data,'MM/DD/YYYY');
            }
          },
          { data: 'description', title: 'Description', className: 'text-center' },
          {
            data: 'withdrawal',
            title: 'Withdrawal',
            className: 'text-center',
            render: function (data) {
              return that._helper.getInINRFormat('INR', data);
            }
          },
          {
            data: 'deposit',
            title: 'Deposit',
            className: 'text-center',
            render: function (data) {
              return that._helper.getInINRFormat('INR', data);
            }
          },
          {
            data: 'closing_balance',
            title: 'Closing Balance',
            className: 'text-center',
            render: function (data) {
              return that._helper.getInINRFormat('INR', data);
            }
          },

        ],
        responsive: true
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

    ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      if (this.dtTrigger) {
        this.dtTrigger.unsubscribe();
      }
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
      });
      if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }

    }

    ngAfterViewInit(): void {
      this.dtTrigger.next();
    }

}
