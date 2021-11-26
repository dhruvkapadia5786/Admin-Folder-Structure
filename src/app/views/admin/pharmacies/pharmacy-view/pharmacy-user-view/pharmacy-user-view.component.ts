import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Toastr } from 'src/app/services/toastr.service';
import Hashids from 'hashids';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';
import { ChangePasswordModalService } from 'src/app/components/change-password-modal/change-password-modal.service';

import { Helper } from 'src/app/services/helper.service';

@Component({
  selector: 'app-pharmacy-user-view',
  templateUrl: './pharmacy-user-view.component.html',
  styleUrls: ['./pharmacy-user-view.component.scss']
})
export class PharmacyUserViewComponent implements OnInit, AfterViewInit, OnDestroy {
  modalRef!: BsModalRef;
  pharmacyUserId: any;
  pharmacyUser: any = { licenses: [] };
  pharmacyDetails: any;
  devices:any[]=[];

  @BlockUI("profile") profileBlockUI!: NgBlockUI;

  dtOptions!: DataTables.Settings;
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  sub1: any;
  constructor(
    public _toastr: Toastr,
    public helper: Helper,
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    private modalService: BsModalService,
    private _changePasswordModalService: ChangePasswordModalService
  ) {
    this.sub1 = this.route?.parent?.paramMap.subscribe((params:any) => {
      this.pharmacyUserId = params.get('userid');
    });
    this.getProfile(this.pharmacyUserId);
  }

  ngOnInit() {
    this.dtOptions = {
      pageLength: 10,
      paging: true,
      serverSide: false,
      search: true,
      searching: true,
      autoWidth: false
    }
    // this.getMyDevices();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  async getProfile(id: any) {
    this.profileBlockUI.start();
    let result = await this.http.get<any>(`api/pharmacies/view_user/${id}`).toPromise();
    if (result && !result.error) {
      console.log('result >>', result)
      this.pharmacyUser = result;
      this.pharmacyDetails = result.pharmacy_details;
      this.rerender();
    } else {
      this._toastr.showError("Unable to fetch user details");
    }
    this.profileBlockUI.stop();
  }

/*   async getMyDevices(){
    await this.http.get(`api/v1/pharmacy/devices?userId=${this.pharmacyUserId}`)
    .subscribe((result: any) => {
      this.devices = result;
    }, err => {});
  } */

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  manageAccount(status: any){
    // let status = this.pharmacyUser.is_active == 0 ? 1 : 0
    const url = 'api/general/manage-account-login'
    this.http.post(url, {user_id: this.pharmacyUserId, is_active: status})
    .subscribe((result: any) => {
      this._toastr.showSuccess('Account Status Updated!');

      // reload user details only
      this.getProfile(this.pharmacyUserId)
    }, err => {
      this._toastr.showError('Error Updating Account Status');
    });
  }

  manageAccountService(){
    let status: any = !this.pharmacyUser.account_service_enabled;
    let url = `api/general/manage-account-service`;
    this.http.post(url, {user_id: this.pharmacyUserId, account_service_enabled: status}).subscribe((res: any) => {
        this.getProfile(this.pharmacyUserId);
    },(err: any) => {});
  }

  goToPasswordChangePage(userChangePasswordID: any): any {
    const hashids = new Hashids('', 10);
    const hashid = hashids.encode(userChangePasswordID);
    // this.router.navigate(['admin', 'changePassword', hashid]);

    this._changePasswordModalService.setFormData({id: hashid});
    this.modalRef = this.modalService.show(ChangePasswordModalComponent,{class:'modal-md'});
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
    if(this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.profileBlockUI) {
      this.profileBlockUI.unsubscribe();
    }
  }

  loginAsUser(userId:number) {
    let url = 'api/v1/admin/users/temp-user/' + userId;
    this.http.get(url).subscribe((res: any) => {
    }, (err: any) => {
    });
  }
}
