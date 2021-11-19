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
  public stripeCustomerId: any;
  public customerUinqueNumber: any;
  userCards: any[] = [];

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

  customerHashId: any;
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
    private _changePasswordModalService: ChangePasswordModalService) {
  }

  ngOnInit() {
    this.route?.parent?.parent?.params.subscribe(params => {
      this.customerId = params['id'];
      this.getCustomerDetails();
      this.getUserCards();
      this._getState();
    });
  }

  getCustomerDetails() {
    const url = 'api/customers/view/' + this.customerId;
    this.http.get(url).subscribe(async (customer: any) => {
      this.customerDetails = customer;
      this.addresses = this.customerDetails.addresses;
      this.getCutomerUniqueNumber(this.customerId, this.customerDetails.type);
      // this.orignalFullFaceImage = await this.loadImage(customer.profileImage);
      // this.orignalLicenseImage = await this.loadImage(customer.licenseImage);
    }, err => {

    });
  }

  getCutomerUniqueNumber(id: any, type: any) {
    this.customerUinqueNumber = this.helper.getUserUniqueId(id, type);
  }

  getUserCards() {
    const url = 'api/v1/admin/customer/stripe_profile/' + this.customerId;
    this.http.get(url).subscribe(
      (resp: any) => {
        this.stripeCustomerId = resp.id;
        this.userCards = resp.sources.data;
      },
      err => {

      }
    );
  }

  private async _getState() {
    const url = 'api/system_states/all';
    this.http.get(url).subscribe(
      (data: any) => {
        this.states = data;
      },
      (err) => {
      }
    );
  }

  loginAsUser() {
    let url = 'api/v1/admin/users/temp-user/' + this.customerDetails.id;
    this.http.get(url).subscribe((res: any) => {
      window.open(environment.client_app_url + 'bypass-login?' + res.urlQuery);
    }, (err: any) => {
    });
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

  manageAccount(stauts: string) {
    const url = 'api/v1/users/manage-account/' + this.customerId + '/' + stauts;
    this.http.get(url)
      .subscribe((result: any) => {
        this._toastr.showSuccess(result.message);
        // reload user details only
        const url2 = 'api/customers/view/' + this.customerId;
        this.http.get(url2).subscribe((customer: any) => {
          this.customerDetails = customer;
        });
      }, err => {
        this._toastr.showError('Error Updating Account Status');
      });
  }

  deleteAddress(address_id: number) {
    const url = 'api/v1/admin/customer/delete_address/' + address_id;
    this.http.post(url, { user_id: this.customerId }).subscribe((data: any) => {
      this.getMyAddresses();
    },
      (err) => {
      });
  }

  getMyAddresses() {
    const url = `api/v1/admin/customer/address/${this.customerId}`;
    this.http.get(url).subscribe((data: any) => {
      this.addresses = data;
    },
      (err) => {
      }
    );
  }

  async openImageCropperModal(eventName: string) {
    let path_to_load = eventName == 'PROFILE' ? (this.customerDetails.profileImage ? this.customerDetails.profileImage : null) : (this.customerDetails.licenseImage ? this.customerDetails.licenseImage : null);
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
    return await this.http.post('api/v1/document/preview', { path: path }, { responseType: 'blob' }).toPromise();
  }

  uploadFullFaceImage(file: any) {
    this.submitted = true;
    const formData: FormData = new FormData();
    this.fullFaceImage = file;
    const url = `api/v1/admin/customer/profileImage/${this.customerId}`;
    formData.append(
      'profile_image',
      this.fullFaceImage,
    );
    this.http.patch(url, formData).subscribe(
      (data: any) => {
        this.submitted = true;
        this.fullFaceEditMode = false;
        this.getCustomerDetails();
      },
      error => {
        this._toastr.showError('Face Photo upload failed');
        this.submitted = false;
      }
    );
  }
  uploadLicenseImage(file: any) {
    this.submitted = true;
    const formData: FormData = new FormData();
    this.licenseImage = file;
    const url = `api/v1/admin/customer/licenseDetails/${this.customerId}`;
    formData.append('userId', this.customerId.toString());
    formData.append(
      'license_photo',
      this.licenseImage,
      this.licenseImage.name
    );
    this.http.patch(url, formData).subscribe(
      (data: any) => {
        this.licenseEntered = true;
        this.submitted = false;
        this.getCustomerDetails();
      },
      error => {
        this._toastr.showError('License upload failed');
        this.submitted = false;
      }
    );
  }

  openAddAddressModal() {
    this._changeAddressModalService.setFormData({
      type: 'ADD_ADDRESS',
      user_id: this.customerId,
      addressModalTitle: 'Add New Address'
    });
    this.modalRef = this.modalService.show(ChangeAddressModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((file: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE ADDRESS */
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
      city: address.city_name,
      state_id: address.state_id,
      zip_code: address.zip_code,
      is_default: address.is_default
    });
    this.modalRef = this.modalService.show(ChangeAddressModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((file: any) => {
      /* CALL METHOD TO MAKE API CALL TO UPDATE ADDRESS */
    });
  }

  openChangePasswordModal() {
    this._changePasswordModalService.setFormData('Change Password');
    this.modalRef = this.modalService.show(ChangePasswordModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((file: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE PASSWORD */
    });
  }

}
