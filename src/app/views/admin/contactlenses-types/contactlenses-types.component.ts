import { Component, OnInit,ChangeDetectorRef, ViewChild, Renderer2, AfterViewInit,OnDestroy } from '@angular/core';
import { ContactlensesTypesService} from './contactlenses-types.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ContactlensesTypesAddEditModalComponent } from '../contactlenses-types-add-edit-modal/contactlenses-types-add-edit-modal.component';
import { ContactLensesTypesAddEditModalService } from '../contactlenses-types-add-edit-modal/contactlenses-types-add-edit-modal.service';

@Component({
  selector: 'app-contactlenses-types',
  templateUrl: './contactlenses-types.component.html',
  styleUrls: ['./contactlenses-types.component.scss']
})
export class ContactlensesTypesComponent implements  OnInit,AfterViewInit, OnDestroy {
  modalRef!: BsModalRef;
  TableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();


  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private router: Router,
    private _renderer: Renderer2,
    private modalService: BsModalService,
    private _lensTypeAddEditModalService: ContactLensesTypesAddEditModalService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _contactLensTypeService:ContactlensesTypesService){

      this.getDTOptions();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
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
            'api/contact_lens/list_types',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.TableData = resp.data;
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
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data) => {
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
            return `<button type="button" class="btn btn-sm btn-primary m-0"  categoryEditId="${full._id}">Edit</button>`;
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
    let that=this;
    this.listenerFn =  this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('categoryEditId')) {
        that.openEditModal(event.target.getAttribute('categoryEditId'));
       }
    });
  }

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		if (this.dtTrigger) {
			this.dtTrigger.unsubscribe();
    }
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
      });
    }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
	}


  openAddModal(){
    this._lensTypeAddEditModalService.setData({event:'ADD'})
    this.modalRef = this.modalService.show(ContactlensesTypesAddEditModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe(()=>{
        this.rerender();
    });
  }

  openEditModal(id:any){
    let data = this.TableData.find((item:any)=>item._id == id);
    this._lensTypeAddEditModalService.setData({event:'EDIT',data:data});
    this.modalRef = this.modalService.show(ContactlensesTypesAddEditModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.rerender();
    });
  }


}
