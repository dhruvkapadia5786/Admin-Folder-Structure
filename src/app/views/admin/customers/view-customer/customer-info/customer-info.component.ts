import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from 'src/app/services/helper.service';
import { Toastr } from 'src/app/services/toastr.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { CustomImageCropperComponent } from 'src/app/components/custom-image-cropper/custom-image-cropper.component';
import { CustomImageCropperService } from 'src/app/components/custom-image-cropper/custom-image-cropper.service';

import { ChangeAddressModalComponent } from 'src/app/components/change-address-modal/change-address-modal.component';
import { ChangeAddressModalService } from 'src/app/components/change-address-modal/change-address-modal.service';

import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';
import { ChangePasswordModalService } from 'src/app/components/change-password-modal/change-password-modal.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {
  modalRef!: BsModalRef;
  public customerDetails: any;
  public customerId: any;
  addresses: any[] = [];

  fullFaceImage: any;
  submitted: boolean = false;
  fullFaceEditMode = false;

  licenseImage!: File;
  licenseEntered!: boolean;

  deviceList: any[] = [];
  states: any[] = [];

  imageUrl: any = '../../../../assets/img/no-image.png';
  _albums = [{
    src: this.imageUrl,
    caption: 'Full Face Image',
    thumb: this.imageUrl
  }];

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private _router: Router,
    public helper: Helper,
    private _toastr: Toastr,
    private _changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private _customImageCropperService: CustomImageCropperService,
    private _changeAddressModalService: ChangeAddressModalService,
    private _changePasswordModalService: ChangePasswordModalService){

    }

  ngOnInit(){
    let activeRoute:any = this.route;
    if(activeRoute){
      activeRoute.parent.parent.params.subscribe((params:any) => {
        this.customerId = params['id'];
        this.getCustomerDetails();
        //this._getState();
      });
    }
  }

  getCustomerDetails(){
    const url = 'api/admin/users/view/' + this.customerId;
    this.http.get(url).subscribe(async (customer: any) => {
      this.customerDetails = customer;
      this.addresses = this.customerDetails.addresses;
    }, err => {

    });
  }

   _getState(){
    const url = 'api/system_states/all';
    this.http.get(url).subscribe((data: any) => {
        this.states = data;
    },
    (err) => {
    });
  }

  loginAsUser() {
    let url = 'api/users/temp-user/' + this.customerDetails.id;
    this.http.get(url).subscribe((res: any) => {
      window.open(environment.client_app_url + 'bypass-login?' + res.urlQuery);
    }, (err: any) => {
    });
  }

  manageAccount(stauts: any){
    const url = 'api/general/manage-account-login';
    this.http.post(url, {user_id: this.customerId, is_active: stauts}).subscribe((result: any) => {
        this._toastr.showSuccess(result.message);
        // reload user details only
        const url2 = 'api/admin/users/view/' + this.customerId;
        this.http.get(url2).subscribe((customer: any) => {
          this.customerDetails = customer;
        });
      }, err => {
        this._toastr.showError('Error Updating Account Status');
      });
  }


  deleteAddress(address_id: number){
    const url = 'api/customers/delete_address/' +  this.customerId;
    this.http.post(url, { address_id: address_id }).subscribe((data: any) => {
      this.getMyAddresses();
    },
    (err) => {

    });
  }

  getMyAddresses(){
    const url = `api/customers/address/${this.customerId}`;
    this.http.get(url).subscribe((data: any) => {
      this.addresses = data;
      this._changeDetectorRef.detectChanges();
    },(err) => {

    });
  }

  async openImageCropperModal(eventName: string) {
    let path_to_load = eventName == 'PROFILE' ? (this.customerDetails.profile_picture ? this.customerDetails.profile_picture : null) : (this.customerDetails.license_image ? this.customerDetails.license_image : null);
    let field_name = eventName == 'PROFILE' ? 'profile_photo' : 'license_photo';
    let file_name: string = path_to_load ? path_to_load.split("/").pop() : null;
    this.loadImage(path_to_load).then((result) => {
      const fr = new FileReader();
      fr.readAsDataURL(result);
      fr.onloadend = () => {
        let loadedImage: any = this.sanitizer.bypassSecurityTrustUrl(fr.result + '');
        loadedImage = loadedImage.changingThisBreaksApplicationSecurity;
        this._customImageCropperService.setFormData({ event_name: eventName, base64image: loadedImage, file_name: file_name });
        this.modalRef = this.modalService.show(CustomImageCropperComponent, { class: 'modal-lg' });
        this.modalRef.content.onImageSaved.subscribe((file: any) => {
          if (eventName == 'PROFILE') {
            this.uploadFullFaceImage(file)
          } else {
            this.uploadLicenseImage(file)
          }
        });
      }
    }).catch((err: any) => {

    });
  }

  async loadImage(path: string) {
    return await this.http.post('api/documents/preview', { path: path }, { responseType: 'blob' }).toPromise();
  }

  uploadFullFaceImage(file: any){
    this.submitted = true;
    const formData: FormData = new FormData();
    this.fullFaceImage = file;
    const url = `api/customers/update_profile_photo/${this.customerId}`;
    formData.append('profile',this.fullFaceImage,this.fullFaceImage.name);
    this.http.post(url, formData).subscribe((data: any) => {
      this.submitted = true;
      this.fullFaceEditMode = false;
      this.getCustomerDetails();
    },
    (error:any) => {
      this._toastr.showError('Face Photo upload failed');
      this.submitted = false;
    });
  }

  uploadLicenseImage(file: any){
      this.submitted = true;
      const formData: FormData = new FormData();
      this.licenseImage = file;
      const url = `api/customers/update_license_photo/${this.customerId}`;
      formData.append('license',this.licenseImage,this.licenseImage.name);
      this.http.post(url, formData).subscribe((data: any) => {
        this.licenseEntered = true;
        this.submitted = false;
        this.getCustomerDetails();
      },
      (error:any) =>{
        this._toastr.showError('License upload failed');
        this.submitted = false;
      });
  }

  openAddAddressModal(){
    this._changeAddressModalService.setFormData({
      type: 'ADD_ADDRESS',
      user_id: this.customerId,
      addressModalTitle: 'Add New Address'
    });
    this.modalRef = this.modalService.show(ChangeAddressModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((resp: any) => {
      this.addNewAddress(resp);
    });
  }

  openEditAddressModal(address: any) {
    this._changeAddressModalService.setFormData({
      type: 'EDIT_ADDRESS',
      addressModalTitle: 'Edit Address',
      user_id: this.customerId,
      address_id: address.id,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 ? address.address_line_2 : '',
      city: address.city,
      state_name: address.state,
      state_id: address.state_id,
      zip_code: address.zip_code,
      is_default: address.is_default
    });
    this.modalRef = this.modalService.show(ChangeAddressModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((resp: any) => {
      this.updateAddress(resp);
    });
  }

  updateAddress(formData: any){
    const url = 'api/customers/update_address/' + this.customerId;
    this.http.post(url, formData).subscribe((resp: any) => {
        this._toastr.showSuccess('Address updated successfully!')
        this.getMyAddresses()
    }, err => {

    });
  }

  addNewAddress(formData: any){
      const url = 'api/customers/add_address/' + this.customerId;
      this.http.post(url, formData).subscribe((resp: any) => {
        this._toastr.showSuccess('Address updated successfully!')
        this.getMyAddresses()
      }, err => {

      });
  }

  openChangePasswordModal(){
    this._changePasswordModalService.setFormData({user_id: this.customerId});
    this.modalRef = this.modalService.show(ChangePasswordModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((resp: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE PASSWORD */
    });
  }

}
