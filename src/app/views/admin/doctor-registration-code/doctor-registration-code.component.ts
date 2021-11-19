import { Component, OnInit, ChangeDetectorRef, Renderer2, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DoctorRegistrationCodeService } from './doctor-registration-code.service';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';

import { DoctorRegistrationCodeAddEditModalComponent } from './doctor-registration-code-add-edit-modal/doctor-registration-code-add-edit-modal.component';
import { DoctorRegistrationCodeAddEditModalService } from './doctor-registration-code-add-edit-modal/doctor-registration-code-add-edit-modal.service';
@Component({
  selector: 'app-doctor-registration-code',
  templateUrl: './doctor-registration-code.component.html'
})
export class DoctorRegistrationCodeComponent implements OnInit, AfterViewInit,OnDestroy {
  modalRef!: BsModalRef;

  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  dtOptions!: DataTables.Settings;

  TableData = [];
  codes: any[] = [];
  constructor(
    private _http: HttpClient,
    private _renderer: Renderer2,
    private _helper: Helper,
    private _changeDetectorRef: ChangeDetectorRef,
    private modalService: BsModalService,
    private _doctorRegistrationCodeService: DoctorRegistrationCodeService,
    private _doctorRegistrationCodeModalService: DoctorRegistrationCodeAddEditModalService) {

  }

  ngOnInit() {
    this.getDTOptions();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('EditId')) {
        let obj = this.TableData.find((obj: any) => obj._id == event.target.getAttribute('EditId'));
        this.openEditModal(obj);
      }
    });
  }

  ngOnDestroy() {
    if (this.dtTrigger){
      this.dtTrigger.unsubscribe();
    }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
  }

  openModal(){
    let that= this;
    this._doctorRegistrationCodeModalService.setData({
      event: 'CREATE'
    })
    this.modalRef = this.modalService.show(DoctorRegistrationCodeAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
        that.rerender();
    });
  }

  openEditModal(obj: any){
    let that= this;
    this._doctorRegistrationCodeModalService.setData({
      event: 'EDIT',
      selectedId: obj._id,
      data: obj
    })
    this.modalRef = this.modalService.show(DoctorRegistrationCodeAddEditModalComponent);
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      that.rerender();
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
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http.post<any>('api/doctor_registration_codes/list',dataTablesParameters,{}).subscribe((resp) => {
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
          data: 'code',
          title: 'Code',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'created_for',
          title: 'Created For',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'created_at',
          title: 'Created At',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return this._helper.getLocalDate(data, 'MM/DD/YYYY');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button type="button" class="btn btn-sm btn-primary m-0"   EditId="${full._id}" >Edit</button>`;
          },
          orderable: false
        }
      ]
    };
  }


  async getAllCodes() {
    this.codes = await this._doctorRegistrationCodeService.findAllCodes();
  }

  async deleteCodeById(id: number) {
    await this._doctorRegistrationCodeService.deleteCodeById(id);
    //this.getAllCodes();
  }

}
