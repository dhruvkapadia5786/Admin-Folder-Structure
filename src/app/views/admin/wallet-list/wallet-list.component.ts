import { Component, OnInit, ViewChild, Renderer2, ChangeDetectorRef,AfterViewInit,OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { Toastr } from 'src/app/services/toastr.service';
import { WalletAddFundModalComponent } from '../wallet-add-fund-modal/wallet-add-fund-modal.component';
import { WalletAddFundModalService } from '../wallet-add-fund-modal/wallet-add-fund-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss']
})
export class WalletListComponent implements OnInit,AfterViewInit,OnDestroy{
  walletTableData:any[] = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  modalRef!:BsModalRef;
  modalSubscription!:Subscription;


  constructor(private route: ActivatedRoute,
    private _http: HttpClient,
    private _toastr: Toastr,
    public _helper: Helper,
    private router: Router,
    private _bsModalService:BsModalService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _walletAddFundModalService:WalletAddFundModalService,
    private _renderer: Renderer2) {
      this.getDTOptions();


    }


    ngOnInit(){
       $.fn.dataTable.ext.errMode = 'none';
      /*$(window).on('resize', () => {
        this.rerender();
      }); */
    }


    listenerFn:any;
    ngAfterViewInit(): void {
      this.dtTrigger.next();
      this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
        if (event.target.hasAttribute('customerId')) {
            window.open(`/admin/patients/view/${event.target.getAttribute('customerId')}/customer-wallet`, '_blank');
        }
        if(event.target.hasAttribute('walletId')){
           let walletObj = this.walletTableData.find((wO:any)=>wO._id == event.target.getAttribute('walletId'));
           if(walletObj){
              this.openAddFundModal(walletObj);
           }
        }
        if (event.target.hasAttribute('patientID')) {
          this.goToDetailsPage(event.target.getAttribute('patientID'));
        }
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
      if(this.blockDataTable){this.blockDataTable.unsubscribe();}
      if(this.modalSubscription){this.modalSubscription.unsubscribe();}
      this.listenerFn();
    }

    goToDetailsPage(patientID: any): any {
      this.router.navigate(['admin', 'patients', 'view', patientID, 'orders']);
    }

    getDTOptions() {
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
        order: [[2, 'desc']],
        ajax: (dataTablesParameters: any, callback) => {
          this.blockDataTable.start();
          this._http
            .post<any>(
              'api/wallets/wallet_list',
              dataTablesParameters,
              {}
            )
            .subscribe((resp) => {
              this.walletTableData = resp.data;
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
            data: 'first_name',
            title: 'Customer Name',
            className: 'text-center  font-weight-normal',
            render: function (data, type, record) {
              if (data) {
                return `<a class="text-primary font-weight-bold" href="javascript:void(0);" patientID=${record._id}>${record.first_name+' '+record.last_name}</a>`;
              } else {
                return `<span>-</span>`;
              }
            }
          },
          {
            data:'email',
            title:'Customer Email',
            className: 'text-center  font-weight-normal'
          },
          {
            data:'cell_phone_number',
            title:'Phone',
            className: 'text-center  font-weight-normal'
          },
          {
            data: 'wallet_balance',
            title: 'Wallet Balance',
            className: 'text-center  font-weight-normal',
            render: function (data: any, type: any, full: any) {
              return `₹${full.wallet_balance}`
            }
          },
          {
            title: 'Action',
            className: 'text-center  font-weight-normal',
            render: function (data: any, type: any, full: any) {
              return `
              <button class="btn btn-sm btn-danger" type="button" walletId=${full._id}><i class="fa fa-usd mr-2"></i>Add Fund</button>
              <button class="btn btn-sm btn-primary m-0" type="button" customerId=${full._id}>View Transactions</button>`;
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

    openAddFundModal(data:any){
      this._walletAddFundModalService.setData(data);
      this.modalRef = this._bsModalService.show(WalletAddFundModalComponent);
      this.modalSubscription = this.modalRef.content.onEventCompleted.subscribe(()=>{
          this.rerender();
      });
    }

}
