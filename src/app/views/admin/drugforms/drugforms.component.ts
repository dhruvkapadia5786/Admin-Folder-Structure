import { Component, OnInit, ViewChild, Renderer2,AfterViewInit,OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DrugFormAddEditModalComponent } from './drugform-add-edit-modal/drugform-add-edit-modal.component';
import { DrugFormAddEditModalService } from './drugform-add-edit-modal/drugform-add-edit-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-drugforms',
  templateUrl: './drugforms.component.html',
  styleUrls: ['./drugforms.component.scss']
})
export class DrugFormsComponent implements OnInit,AfterViewInit,OnDestroy {
  drugFormsTableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  modalRef!: BsModalRef;


  constructor(
    private _http: HttpClient,
    private modalService: BsModalService,
    private _drugFormAddEditModalService: DrugFormAddEditModalService,
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
            'api/drugforms/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.drugFormsTableData = resp.data;
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
          data: 'singular',
          title: 'singular',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'plural',
          title: 'plural',
          className: 'text-center  font-weight-normal'
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
      if (event.target.hasAttribute('drugFormEditId')) {
        this.openEditModal(event.target.getAttribute('drugFormEditId'));
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
    this._drugFormAddEditModalService.setData({event:'ADD'})
    this.modalRef = this.modalService.show(DrugFormAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
        this.rerender();
    });
  }

  openEditModal(id:any){
    let data = this.drugFormsTableData.find((item:any)=>item._id == id);
    this._drugFormAddEditModalService.setData({event:'EDIT',data:data});
    this.modalRef = this.modalService.show(DrugFormAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.rerender();
    });
  }

}