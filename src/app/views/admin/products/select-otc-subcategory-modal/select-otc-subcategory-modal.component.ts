import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal'
import {SelectOtcSubcategoryModalService} from './select-otc-subcategory-modal.service';

@Component({
  selector: 'app-select-otc-subcategory-modal',
  templateUrl: './select-otc-subcategory-modal.component.html',
  styleUrls: ['./select-otc-subcategory-modal.component.scss']
})
export class SelectOtcSubcategoryModalComponent implements OnInit {


  details:any;
  allCategories:any[]=[];
  @Output() onApplySelected: EventEmitter<any> = new EventEmitter();

  constructor(
    private _bsModalRef:BsModalRef,
    private _selectOtcSubcategoryModalService:SelectOtcSubcategoryModalService){
  }

  ngOnInit(){
    this.details=this._selectOtcSubcategoryModalService.getFormData();
    this.allCategories = JSON.parse(JSON.stringify(this.details.categories));

  }

  closeModal(){
    this._bsModalRef.hide();
  }

  handleChangeSubcategory(event:any,categoryIndex:number){
     if(event.target.checked){
      this.allCategories[categoryIndex].is_checked= true;
     }
  }

  applySelected(){
    let checkedCategories = this.allCategories.filter((item:any)=>item.is_checked==true);
    checkedCategories.map((item:any)=>item.sub_categories = item.sub_categories.filter((item:any)=>item.is_checked==true));
    this.onApplySelected.emit(checkedCategories);
    this.closeModal();
  }

}
