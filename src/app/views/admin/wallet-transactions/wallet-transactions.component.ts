import { Component, OnInit, Renderer2,ElementRef, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router,ActivatedRoute } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-wallet-transactions',
  templateUrl: './wallet-transactions.component.html',
  styleUrls: ['./wallet-transactions.component.scss']
})
export class WalletTransactionsComponent implements OnInit, AfterViewInit,OnDestroy {

  walletTransactionsTableData = new Array<any>();
  totalTransactions:number=0;
  dtOptions!: DataTables.Settings;

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

      this.getDTOptions();

    }

    ngOnInit() {
      $.fn.dataTable.ext.errMode = 'none';
      $(window).on('resize', () => {
        this.rerender();
      });
    }

    listenerFn:any;
    ngAfterViewInit(): void {
      this.dtTrigger.next();
      this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
        if (event.target.hasAttribute('patientID')) {
          this.goToDetailsPage(event.target.getAttribute('patientID'));
        }
      });
    }

    ngOnDestroy(): void {
      if (this.dtTrigger) {
        this.dtTrigger.unsubscribe();
      }
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      if(this.blockDataTable){this.blockDataTable.unsubscribe();}
      this.listenerFn();
    }


    getDTOptions(){
      let that=this;
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        paging: true,
        serverSide: true,
        search: true,
        searching: true,
        autoWidth: true,
        ordering: true,
        order: [[0, 'desc']],
        ajax: (dataTablesParameters: any, callback) => {
          this.blockDataTable.start();
          this._http
            .post<any>(
              `api/wallets/all_wallet_transactions`,
              dataTablesParameters,
              {}
            )
            .subscribe((resp) => {
              this.walletTransactionsTableData = resp.data;
              this.totalTransactions = resp.recordsTotal;
              this.blockDataTable.stop();
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: resp.data
              });
              this._changeDetectorRef.detectChanges();
            });
        },
        columns: [
          {
            data: 'transaction_date',
            title: 'Date',
            className: 'text-center font-weight-normal',
            render: function (data) {
              return that._helper.getFormattedDate(data,'MM/DD/YYYY');
            }
          },
          {
            data: 'user.first_name',
            title: 'Customer Name',
            className: 'text-center font-weight-normal',
            render: function (data, type, record) {
              if (data) {
                return `<a class="text-primary font-weight-bold" href="javascript:void(0);" patientID=${record.user_id}>${record.user.first_name+' '+record.user.last_name}</a>`;
              } else {
                return `<span>-</span>`;
              }
            }
          },
          { data: 'description', title: 'Description', className: 'text-center font-weight-normal' },
          {
            data: 'withdrawal',
            title: 'Withdrawal',
            className: 'text-center font-weight-normal',
            render: function (data) {
              return that._helper.getInINRFormat('INR', data);
            }
          },
          {
            data: 'deposit',
            title: 'Deposit',
            className: 'text-center font-weight-normal',
            render: function (data) {
              return that._helper.getInINRFormat('INR', data);
            }
          },
          {
            data: 'closing_balance',
            title: 'Closing Balance',
            className: 'text-center font-weight-normal',
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


    goToDetailsPage(patientID: any): any {
      this.router.navigate(['admin', 'patients', 'view', patientID, 'orders']);
    }
}
