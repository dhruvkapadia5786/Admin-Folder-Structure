import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Toastr } from 'src/app/services/toastr.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OtcCategoriesAddEditModalService } from '../../otc-categories-add-edit-modal/otc-categories-add-edit-modal.service';
import { OtcCategoriesAddEditModalComponent } from '../../otc-categories-add-edit-modal/otc-categories-add-edit-modal.component';

@Component({
  selector: 'app-otc-category-info',
  templateUrl: './otc-category-info.component.html',
  styleUrls: ['./otc-category-info.component.scss']
})
export class OtcCategoryInfoComponent implements OnInit {

  categoryId: any;
  OTCCategoryDetails:any;
  modalRef!: BsModalRef;
  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    public _toastr: Toastr,
    private modalService: BsModalService,
    private _hcAddEditModalService: OtcCategoriesAddEditModalService,
    private _changeDetectorRef: ChangeDetectorRef){
      let activeRoute:any = this.route;
      if(activeRoute){
         this.categoryId = activeRoute.parent.parent.snapshot.paramMap.get('id');
      }
  }

  ngOnInit(){
    this.getOTCCategoryDetails();
  }

  getOTCCategoryDetails(){
    const url = 'api/otc_categories/view/' + this.categoryId;
    this.http.get(url).subscribe((res: any) => {
         this.OTCCategoryDetails = res;
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }

  openEditModal(){
    this._hcAddEditModalService.setData({event:'EDIT',data:this.OTCCategoryDetails});
    this.modalRef = this.modalService.show(OtcCategoriesAddEditModalComponent,{class:'modal-lg'});
    this.modalRef.content.onEventCompleted.subscribe(()=>{
      this.getOTCCategoryDetails();
    });
  }

  updateSequence (event: any) {
    let dataToSend: any = []
     event.data.forEach((obj: any) => {
        dataToSend.push({ ...obj.item, sequence:obj.sequence });
    });
    let url: string = `api/otc_categories/update_sequence/${this.categoryId}`;
    this.http.post(url, { mode: event.mode, sequences: dataToSend })
      .subscribe(data => {
        this.getOTCCategoryDetails();
        this._toastr.showSuccess('Sequence Updated Successfully');
      }, err => {
        this._toastr.showError('Unable to update sequence. Please try again');
      });
  }

}
