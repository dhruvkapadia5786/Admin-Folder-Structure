import { Component, OnInit, ViewChild, Renderer2, AfterViewInit,OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommentCategoryAddEditModalComponent } from './comment-category-add-edit-modal/comment-category-add-edit-modal.component';
import { CommentCategoryAddEditModalService } from './comment-category-add-edit-modal/comment-category-add-edit-modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-comment-categories',
  templateUrl: './comment-categories.component.html',
  styleUrls: ['./comment-categories.component.scss']
})
export class CommentCategoriesComponent implements OnInit,AfterViewInit,OnDestroy {
  commentCategoriesTableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  modalRef!: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private router: Router,
    private modalService: BsModalService,
    private _renderer: Renderer2,
    private _ccAddEditModalService: CommentCategoryAddEditModalService
  ) {
    this.getDTOptions();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
        if (event.target.hasAttribute('commentCategoryEditId')) {
          this.openEditModal(event.target.getAttribute('commentCategoryEditId'));
        }
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) { this.dtTrigger.unsubscribe(); }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
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
      order: [[1, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/comment_categories/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.commentCategoriesTableData = resp.data;
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
          title: 'Comment Categories',
          className: 'text-left  font-weight-normal'
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
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            return `<button class="btn btn-sm btn-primary m-0" commentCategoryEditId=${full._id}>EDIT</button>`;
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



  openAddModal(){
    this._ccAddEditModalService.setData({event:'ADD'})
    this.modalRef = this.modalService.show(CommentCategoryAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
        this.rerender();
    });
  }

  openEditModal(id:any){
    let data = this.commentCategoriesTableData.find((item:any)=>item._id == id);
    this._ccAddEditModalService.setData({event:'EDIT',data:data});
    this.modalRef = this.modalService.show(CommentCategoryAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.rerender();
    });
  }

}
