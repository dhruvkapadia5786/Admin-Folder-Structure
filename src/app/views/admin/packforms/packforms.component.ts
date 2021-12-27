import { Component, OnInit, ViewChild, Renderer2,AfterViewInit,OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PackformAddEditModalComponent } from './packform-add-edit-modal/packform-add-edit-modal.component';
import { PackformAddEditModalService } from './packform-add-edit-modal/packform-add-edit-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-packforms',
  templateUrl: './packforms.component.html',
  styleUrls: ['./packforms.component.scss']
})
export class PackformsComponent implements OnInit,AfterViewInit,OnDestroy {
  packformsTableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  modalRef!: BsModalRef;


  constructor(
    private _http: HttpClient,
    private modalService: BsModalService,
    private _packformAddEditModalService:PackformAddEditModalService,
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
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/packforms/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.packformsTableData = resp.data;
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
          title: 'Name',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'slug',
          title: 'Slug',
          className: 'text-center  font-weight-normal'
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-sm btn-primary m-0" packformEditId=${full._id}>Edit</button>`;
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
      if (event.target.hasAttribute('packformEditId')) {
        this.openEditModal(event.target.getAttribute('packformEditId'));
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
    this._packformAddEditModalService.setData({event:'ADD'})
    this.modalRef = this.modalService.show(PackformAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
        this.rerender();
    });
  }

  openEditModal(id:any){
    let data = this.packformsTableData.find((item:any)=>item._id == id);
    this._packformAddEditModalService.setData({event:'EDIT',data:data});
    this.modalRef = this.modalService.show(PackformAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.rerender();
    });
  }

}
