import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CountryAddEditModalComponent } from './country-add-edit-modal/country-add-edit-modal.component';
import { CountryAddEditModalService } from './country-add-edit-modal/country-add-edit-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountryComponent implements OnInit,AfterViewInit,OnDestroy {
  countryTableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  modalRef!: BsModalRef;

  constructor(
    private _http: HttpClient,
    private modalService: BsModalService,
    private _countryAddEditModalService: CountryAddEditModalService,
    private _renderer: Renderer2) {
    this.getDTOptions();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
  }

  getDTOptions() {
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
      order: [[4, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/system_countries/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.countryTableData = resp.data;
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
          data: 'name',
          title: 'Country Name',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'code',
          title: 'Country Code',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'capital',
          title: 'Capital',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'iso_code',
          title: 'ISO Code',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'currency_code',
          title: 'Currency Code',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'continent',
          title: 'Continent',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'phone_code',
          title: 'Phone Code',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data) => {
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
            return `<button class="btn btn-sm btn-primary m-0" countryEditId=${full._id}>Edit</button>`;
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
      if (event.target.hasAttribute('countryEditId')) {
        this.openEditModal(event.target.getAttribute('countryEditId'));
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

  openAddModal(){
    this._countryAddEditModalService.setData({event:'ADD'})
    this.modalRef = this.modalService.show(CountryAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
        this.rerender();
    });
  }

  openEditModal(id:any){
    let data = this.countryTableData.find((item:any)=>item._id == id);
    this._countryAddEditModalService.setData({event:'EDIT',data:data});
    this.modalRef = this.modalService.show(CountryAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.rerender();
    });
  }

}
