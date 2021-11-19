import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'

import { ViewCustomerService } from './view-customer.service';
import { UploadMediaModalComponent } from 'src/app/components/upload-media-modal/upload-media-modal.component';
import { UploadMediaModalService } from 'src/app/components/upload-media-modal/upload-media-modal.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})
export class ViewCustomerComponent implements OnInit {
  modalRef!: BsModalRef;
  public customerDetails: any;
  public customerId: any;

  constructor(public http: HttpClient,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    public viewCustomerService:ViewCustomerService,
    private _uploadModalService:UploadMediaModalService
  ){
    viewCustomerService.customerDetailsSubscribed$.subscribe(customer => {
        viewCustomerService.publishCustomerDetails(this.customerDetails);
    });
  }

  ngOnInit(){
    this.customerId = this.route.snapshot.params.id;
    this.getCustomerDetails();
  }

  getCustomerDetails(){
    const url = 'api/customers/view/' + this.customerId;
    this.http.get(url).subscribe((customer: any) => {
        this.customerDetails=customer;
        this.viewCustomerService.publishCustomerDetails(customer);
      }, err => {});
  }

  openUploadDocumentModal() {
    this._uploadModalService.setFormData('Patient Document');
    this.modalRef = this.modalService.show(UploadMediaModalComponent, { class: 'modal-lg' });
    this.modalRef.content.onEventCompleted.subscribe((file: any) => {
      /* CALL METHOD TO MAKE API CALL TO SAVE DOCUMENTS */
    });
  }
}
