import { ChangeDetectorRef, Component, OnInit, ViewChild, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Toastr } from 'src/app/services/toastr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pharmacy-user-management',
  templateUrl: './pharmacy-user-management.component.html',
  styleUrls: ['./pharmacy-user-management.component.scss']
})
export class PharmacyUserManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings={};
  dtTrigger: Subject<any> = new Subject();
  listenerFn:any;

  userListData = new Array();
  userTypes: any = {
    7: 'Manager',
    8: 'Pharmacist',
    9: 'Technician',
    10: 'Cashier'
  }
  currentUrl:string;
  sub1: any;
  pharmacyId: any;
  constructor(
    public http: HttpClient,
    public _router:Router,
    public _route:ActivatedRoute,
    public toastr: Toastr,
    private _renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef){
    let url=this._router.url;
    url = url.slice(0, url.lastIndexOf('/'));
    this.currentUrl=url;

    this._route?.parent?.parent?.paramMap.subscribe(params => {
      this.pharmacyId = params.get('id');
    });
  }

  ngOnInit(){
    this.getDTOptions();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.listenerFn = this._renderer.listen('document', 'click', (event:any):void => {
      if (event.target.hasAttribute('userViewId')) {
        this.goToViewPage(event.target.getAttribute('userViewId'));
      }
      if (event.target.hasAttribute('userEditId')) {
        this.goToEditPage(event.target.getAttribute('userEditId'));
      }
    });
  }


  manageAccountLogin(userId:number,status:number){
    const url = 'api/v1/users/manage-account-login/' + userId+'/'+status;
    this.http.get(url).subscribe((result: any) => {
      this.toastr.showSuccess('Account Login Status Successfully Updated');
    },(err:any) => {
      this.toastr.showError('Error Updating Account Login');
    });
  }

  getDocumentUrl(documentURL:any) {
    return environment.api_url + documentURL.substring(3);
  }

  getGender(gender: any){
    let genderText='';
    switch (gender) {
      case '1':
        genderText= 'Male';
        break;
      case '2':
        genderText= 'Female';
        break;
      default:
        genderText= 'Male';
        break;
    }
    return genderText;
  }

  goToViewPage(userViewId: any): any {
    this._router.navigate([`${this.currentUrl}/view-user/${userViewId}`]);
  }
  goToEditPage(userEditId: any): any {
    this._router.navigate([`${this.currentUrl}/edit-user/${userEditId}`])
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
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
        this.http
          .post<any>(
            'api/pharmacies/all_users/'+ this.pharmacyId,
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.userListData = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          });
      },
      columns: [
        {
          data: 'user_id',
          title: 'ID',
          className: 'text-center font-weight-normal',
        },
        {
          data: 'full_name',
          title: 'Name',
          className: 'text-center font-weight-normal',
        },
        {
          data: 'email',
          title: 'Email',
          className: 'text-center font-weight-normal',
        },
        {
          data: 'cell_phone_number',
          title: 'Phone',
          className: 'text-center font-weight-normal',
        },
        {
          data: 'is_active',
          title: 'Login Enable',
          className: 'text-center',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'type',
          title: 'Role',
          className: 'text-center font-weight-normal',
          render: (data: any) => {
            return `<span>${this.userTypes[data]}</span>`;
          }
        },
        {
          title: 'Action',
          className: 'text-center',
          render: function (data: any, type: any, full: any) {
            return `<div class="btn-group"><button class="btn btn-default btn-sm m-0" userViewId=${full.user_id}>View</button>
             &nbsp;&nbsp;
             <button class="btn btn-sm btn-primary m-0" userEditId=${full.user_id}>Edit</button></div>`;
          },
          orderable: false
        }
      ]
    };
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
    this.listenerFn();
  }
}
