import { Component, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from '../../../../services/helper.service';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { TECHNICIAN_STATUS } from '../../../../enums/order-status.enum';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { Toastr } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-tech-view',
  templateUrl: './tech-view.component.html',
  styleUrls: ['./tech-view.component.scss']
})

export class TechViewComponent implements OnInit, AfterViewInit {
  techId: any;
  techDetails: any;
  customerUinqueNumber: any;

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
    private helper: Helper,
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
        console.log('tech >> ', tech)
        this.techDetails = tech;
        this.getCutomerUniqueNumber(this.techId, this.techDetails.type);
      },(err:any) => {

      });
  }

  getTechDocuments(){
    const url = 'api/v1/admin/document/for_user/' + this.techId;
    this.http.post(url, {})
      .subscribe((documents: any) => {
        this.techDocuments = documents.data;
      }, err => {
      });
  }

  getDocumentUrl(documentURL: any){
    return environment.api_url + documentURL.substring(3);
  }

  getCutomerUniqueNumber(id: any, type: any){
    this.customerUinqueNumber = this.helper.getUserUniqueId(id, type);
  }

  getGender(gender: any) {
    if (gender == '1') {
      return 'Male';
    } else if (gender == '2') {
      return 'Female';
    } else {
      return gender;
    }
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


  getConsultationDTOptions() {
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
        this.http.post<any>(
          `api/v1/consultation/forTechnician?tId=${this.techId}`,
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
				  return `<a consultationDetailID=${record.id} href="javascript:void(0);" class="text-primary font-weight-bold">C-${data}</a>`;
				}
        },
        {
          data:'consultation_type',
          title: 'Consultation Type',
          className: 'text-center',
            render: function (data:any, type:any, record:any) {
              if (data=='NEW') {
              return '<span class="badge badge-success">NEW</span>'
              }else{
              return '<span class="badge badge-primary">FOLLOWUP</span>'
              }
            }
          },
          {
          data:'type',
          title: 'Type',
          className: 'text-center',
          render: function (data:any, type:any, record:any) {
            if (data=='REFERRED_BY_PHYSICIAN') {
            return '<span class="badge badge-primary">Referred By Physician</span>'
            }else{
            return '<span class="badge badge-warning">First Available Physician</span>'
            }
          }
        },
			  {
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
			  },
			  {
				data:'pharmacy_name',
				title:'Pharmacy Name',
				className: 'text-center',
				render: function (data:any, type:any, record:any) {
				  if (data) {
					return data;
				  }else{
					return '-'
				  }
				}
			  },
			  {
				data:'consultation_charge',
				title:'Consultation Charge',
				className: 'text-center',
				render: function (data: any) {
					const _helper = new Helper();
					return _helper.getInDollarFormat('USD', data);
				}
			  },
			  {
				data:'system_status',
				title: 'Status',
				className: 'text-center',
				render: function (data:any, type:any, record:any) {
          if(data=='ASSIGNED_TO_TECHNICIAN'){return `<span class="badge badge-info">Assigned To Technician</span>`;}
          if(data=='APPROVED_BY_TECHNICIAN'){return `<span class="badge badge-info">Approved To Technician</span>`;}
          else if(data=='ASSIGNED_TO_DOCTOR'){return `<span class="badge badge-primary">Assigned To Doctor</span>`}
          else if(data=='CONSULTATION_COMPLETED'){return `<span class="badge badge-success">Completed</span>`}
          else if(data=='CONSULTATION_REFUNDED'){return `<span class="badge badge-danger">Refunded</span>`}
          else {return '';}
				}
			  },
			  {
				data: 'created_at',
				title: 'Date',
				className: 'text-center',
				render: (data: any) => {
				  if (data) {
					return this.helper.getLocalDate(data, 'MM/DD/YYYY');
				  } else {
					return '<span></span>';
				  }
				}
        }
			]
    };
  }

  loginAsUser () {
    let url = 'api/v1/admin/users/temp-user/' + this.techId;
    this.http.get(url).subscribe((res: any) => {
      window.open(environment.client_app_url+'bypass-login?'+res.urlQuery);
    }, (err: any) => {
    });
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
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback: any) => {
        this.blockDataTable.start();
        this.http
          .post<any>(
            'api/v1/technician/orders/' + this.techId + '/' + this.selectedKitId,
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
              return  `<a href="javascript:void(0);" orderDetailsID='${record.id}'>${data}</a>`;
            } else {
              return '<span></span>';
            }
          }
        },
        { data: 'user.firstName', title: 'First Name' },
        { data: 'user.lastName', title: 'Last Name' },
        {
          data: 'user.dateOfBirth',
          title: 'Age',
          render: function (data: any) {
            if (data) {
              return moment().diff(data, 'years');
            } else {
              return '<span></span>';
            }
          }
        },
        { data: 'medicineKit.name', title: 'Medicine Kit' },
        {
          data: 'technician_status',
          title: 'Order Status',
          className: 'text-center',
          render: function (data: any) {
            if (data == 1) {
              return `<span class='badge badge-info'>${TECHNICIAN_STATUS[data]}</span>`;
            }
            if (data == 2) {
              return `<span class='badge badge-success'>${TECHNICIAN_STATUS[data]}</span>`;
            }
            else if (data == 4) {
              return `<span class='badge badge-warning'>${TECHNICIAN_STATUS[data]}</span>`;
            }
            else if (data == 5) {
              return `<span class='badge badge-danger'>${TECHNICIAN_STATUS[data]}</span>`;
            }
            else if (data == 6) {
              return `<span class='badge badge-danger'>${TECHNICIAN_STATUS[data]}</span>`;
            }
            else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'createdOn',
          title: 'Order Date',
          render: (data: any) => {
            if (data) {
              //let _helper = new Helper();
              return this.helper.getLocalDate(data, 'MM/DD/YYYY');
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

  manageAccountLogin(status:number){
      const url = 'api/v1/users/manage-account-login/' + this.techId+'/'+status;
      this.http.get(url).subscribe((result: any) => {
        this._toastr.showSuccess('Account Login Status Successfully Updated');
        this.getTechDetails();
      }, (err:any) => {
        this._toastr.showError('Error Updating Account Login');
      });
  }

}
