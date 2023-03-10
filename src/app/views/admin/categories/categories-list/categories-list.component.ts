import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { CategoriesAddEditModalComponent } from '../categories-add-edit-modal/categories-add-edit-modal.component';
import { CategoriesAddEditModalService } from '../categories-add-edit-modal/categories-add-edit-modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, AfterViewInit, OnDestroy {
  modalRef!: BsModalRef;
  healthConditionList: any[] = [];

  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  constructor(
    private router:Router,
    private _renderer:Renderer2,
    private _http: HttpClient,
    private modalService: BsModalService,
    private _hcAddEditModalService: CategoriesAddEditModalService
  ) {
     this.getDTOptions();
  }

  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    let that=this;
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('hcEditId')) {
         that.openEditModal(event.target.getAttribute('hcEditId'));
      }else if (event.target.hasAttribute('hcViewId')) {
        that.goToDetailsPage(event.target.getAttribute('hcViewId'));
      }
    });
  }

  goToDetailsPage(categoryId: any): any {
    this.router.navigate(['admin', 'categories', 'view', categoryId]);
  }

  ngOnDestroy() {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  openAddModal(){
    this._hcAddEditModalService.setData({event:'ADD'})
    this.modalRef = this.modalService.show(CategoriesAddEditModalComponent,{class:'modal-full-lg'});
    this.modalRef.content.onEventCompleted.subscribe(()=>{
        this.rerender();
    });
  }

  openEditModal(id:any){
    let data = this.healthConditionList.find((item:any)=>item.id == id);
    this._hcAddEditModalService.setData({event:'EDIT',data:data});
    this.modalRef = this.modalService.show(CategoriesAddEditModalComponent,{class:'modal-full-lg'});
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.rerender();
    });
  }

  getDTOptions() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[1, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/admin/categories/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.healthConditionList = resp.data;

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
          data:'image',
          title: 'Image',
          orderable: false,
          className: 'text-left  font-weight-normal',
          render: (data: any) => {
            if (data) {
              let url = environment.api_url + data;
              return `<img src=${url} height="80" width="80" />`;
            } else {
              return `-`;
            }
          }
        },
        {
          data: 'name',
          title: 'Name',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data: any) => {
            if (data) {
              return `<i class="fa fa-check text-success"></img>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button type="button" class="btn btn-sm btn-primary"  hcEditId="${full.id}">Edit</button>
            <button type="button" class="ml-2 btn btn-sm btn-primary"  hcViewId="${full.id}">View</button>`;
          },
          orderable: false
        }
      ]
    };

  }



}
