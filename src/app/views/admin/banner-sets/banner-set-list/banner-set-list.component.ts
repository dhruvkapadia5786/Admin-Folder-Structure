import { Component, OnInit, ViewChild, Renderer2,AfterViewInit,OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner-set-list',
  templateUrl: './banner-set-list.component.html',
  styleUrls: ['./banner-set-list.component.scss']
})
export class BannerSetListComponent implements OnInit {

  bannerSetsTableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private _http: HttpClient,
    private router: Router,
    private _renderer: Renderer2) {
    this.getDTOptions();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
  }

  getDTOptions(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
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
        this._http
          .post<any>(
            'api/bannersets/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.bannerSetsTableData = resp.data;
            this.blockDataTable.stop();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          },(err:any)=>{
            this.blockDataTable.stop();
            callback({
              recordsTotal: 0,
              recordsFiltered: 0,
              data: []
            });
          });
      },
      columns: [
        {
          data: 'set_type',
          title: 'Set Type',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'banners',
          title: 'Banners',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any){
            return `${data.length}`
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-sm btn-primary m-0" drugFormEditId=${full._id}>Edit</button>`;
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
    this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
      if(event.target.hasAttribute('drugFormEditId')){
        this.gotoEditBannerSet(event.target.getAttribute('drugFormEditId'));
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

  gotoAddBannerSet(){
    this.router.navigate(['admin', 'bannersets', 'add']);
  }

  gotoEditBannerSet(_id:any){
    this.router.navigate(['admin', 'bannersets', 'edit', _id]);
  }

}
