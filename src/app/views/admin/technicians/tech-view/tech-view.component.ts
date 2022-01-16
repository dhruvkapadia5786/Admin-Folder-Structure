import { Component, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '../../../../services/helper.service';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Toastr } from 'src/app/services/toastr.service';
import { orderHelper } from 'src/app/services/orderHelper.service';
import { consultationHelper } from 'src/app/services/consultationHelper.service';

@Component({
  selector: 'app-tech-view',
  templateUrl: './tech-view.component.html',
  styleUrls: ['./tech-view.component.scss']
})

export class TechViewComponent implements OnInit, AfterViewInit {
  techId: any;
  techDetails: any;

  techOrderTableData = new Array();
  dtOptions: any = {};
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();
  dtOptionsConsultation: any = {};

  selectedKitId: any;
  techDocuments: any[] = [];


  constructor(public http: HttpClient,
    private route: ActivatedRoute,
    public helper: Helper,
    public _orderHelper:orderHelper,
    public _consultationHelper:consultationHelper,
    private router: Router,
    private _toastr: Toastr,
    private _renderer: Renderer2) {
    this.selectedKitId = 0;
    this.techId = this.route.snapshot.params.id;
    this.getDTOptions();
    this.getConsultationDTOptions();
    this.getTechDocuments();
  }

  ngOnInit() {
    this.getTechDetails();
  }

  getTechDetails(){
    const url = 'api/technicians/view/' + this.techId;
    this.http.get(url).subscribe((tech: any) => {
        this.techDetails = tech;
      },(err:any) => {

      });
  }

  getTechDocuments(){
    const url = 'api/document/for_user/' + this.techId;
    this.http.post(url, {})
      .subscribe((documents: any) => {
        this.techDocuments = documents.data;
      }, err => {
      });
  }

  getDocumentUrl(documentURL: any){
    return environment.api_url + documentURL.substring(3);
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  tabEvents(event: any) {
    if (event == 0) {
      this.getTechDetails();
    } else if (event == 1) {
      this.getDTOptions();
    } else if (event == 2) {
      this.getConsultationDTOptions();
    }
  }

  getConsultationDTOptions(){
    let that=this;
    this.dtOptionsConsultation ={
			pagingType: 'full_numbers',
			pageLength: 10,
			paging: true,
			serverSide: true,
			search: true,
			searching: true,
			autoWidth: true,
			ordering: true,
			order: [[0, 'desc']],
			ajax: (dataTablesParameters: any, callback:any) => {
			  this.blockDataTable.start();
        dataTablesParameters.filter = {};
        dataTablesParameters.filter.TECHNICIAN_ID = this.techId;
        this.http.post<any>(
          `api/consultations/list`,
          dataTablesParameters
        ).subscribe((resp) => {
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
				data: 'consultation_number',
				title: 'Consultation Number',
				className: 'text-center',
				render: function (data:any, type:any, record:any) {
				  return `<a consultationDetailID=${record._id} href="javascript:void(0);" class="text-primary font-weight-bold">C-${data}</a>`;
				}
        },
        {
          data: 'user.first_name',
          title: 'Customer Name',
          render: function (data: any, type: any, record: any){
            return `${record.user.first_name} ${record.user.last_name}`
          }
      },
      {
        data: 'user.date_of_birth',
        title: 'Age',
        render: function (data: any) {
          if (data) {
            return moment().diff(data, 'years');
          } else {
            return '<span></span>';
          }
        }
      },
      { data: 'health_condition_name', title: 'Health Condition' },
			  /* {
				data:'doctor_name',
				title: 'Physician Name',
				className: 'text-center',
				render: function (data:any, type:any, record:any) {
					if (data) {
					  return data;
					}else{
					  return '-'
					}
				}
			  }, */
			  {
				data:'total_amount',
				title:'Consultation Charge',
				className: 'text-center',
				render: function (data: any) {
					const _helper = new Helper();
					return _helper.getInINRFormat('INR', data);
				}
			  },
			  {
          data:'technician_status',
          title: 'Status',
          className: 'text-center',
          render: function (data:any, type:any, record:any){
              return that._consultationHelper.getTechnicianStatus(data);
          }
			  },
			  {
				data: 'consultation_place_datetime',
				title: 'Date',
				className: 'text-center',
				render: (data: any) => {
				  if (data) {
					return this.helper.getFormattedDate(data, 'DD-MM-YYYY hh:mm A');
				  } else {
					return '<span></span>';
				  }
				}
        }
			]
    };
  }

  loginAsUser(){
    let url = 'api/users/temp-user/' + this.techId;
    this.http.get(url).subscribe((res: any) => {
      window.open(environment.client_app_url+'bypass-login?'+res.urlQuery);
    }, (err: any) => {
    });
  }

  getDTOptions(){
    let that=this;
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
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback: any) => {
        this.blockDataTable.start();
        dataTablesParameters.filter = {};
        dataTablesParameters.filter.TECHNICIAN_ID = this.techId;
        this.http
          .post<any>(
            'api/orders/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.techOrderTableData = resp.data;
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
          data: 'order_number',
          title: 'Order #',
          render: function (data: any, type: any, record: any) {
            if (data) {
              return  `<a href="javascript:void(0);" orderDetailsID='${record._id}'>${data}</a>`;
            } else {
              return '<span></span>';
            }
          }
        },
        {
            data: 'user.first_name',
            title: 'Customer Name',
            render: function (data: any, type: any, record: any){
              return `${record.user.first_name} ${record.user.last_name}`
            }
        },
        {
          data: 'user.date_of_birth',
          title: 'Age',
          render: function (data: any) {
            if (data) {
              return moment().diff(data, 'years');
            } else {
              return '<span></span>';
            }
          }
        },
        { data: 'medicine_kit_details.name', title: 'Medicine Kit' },
        {
          data:'total_amount',
          title:'Total',
          className: 'text-center',
          render: function (data: any) {
            const _helper = new Helper();
            return _helper.getInINRFormat('INR', data);
          }
        },
        {
          data: 'technician_status',
          title: 'Order Status',
          className: 'text-center',
          render: function (data: any){
             return that._orderHelper.getTechnicianStatus(data);
          }
        },
        {
          data: 'order_place_datetime',
          title: 'Order Date',
          render: (data: any) => {
            if (data) {
              return this.helper.getLocalDate(data, 'DD-MM-YYYY hh:mm A');
            } else {
              return '<span></span>';
            }
          }
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('orderDetailsID')) {
        this.goToOrderDetailsPage(event.target.getAttribute('orderDetailsID'));
      }
      if (event.target.hasAttribute('consultationDetailID')) {
				this.gotoConsultation(event.target.getAttribute('consultationDetailID'));
			}
    });
  }

  goToOrderDetailsPage(orderId: any): any {
    this.router.navigate(['admin', 'orders', 'view', orderId]);
  }

  gotoConsultation(consultationID:number){
    this.router.navigate(['admin','consultation','view',consultationID]);
  }

  manageAccountLogin(status:boolean){
      const url = 'api/general/manage-account-login';
      this.http.post(url, {user_id: this.techId, is_active: status}).subscribe((result: any) => {
        this._toastr.showSuccess('Account Login Status Successfully Updated');
        this.getTechDetails();
      }, (err:any) => {
        this._toastr.showError('Error Updating Account Login');
      });
  }

}
