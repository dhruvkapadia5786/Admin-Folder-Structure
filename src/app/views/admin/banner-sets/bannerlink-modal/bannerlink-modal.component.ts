import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { BannerlinkModalService } from './bannerlink-modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bannerlink-modal',
  templateUrl: './bannerlink-modal.component.html',
  styleUrls: ['./bannerlink-modal.component.scss']
})
export class BannerlinkModalComponent implements OnInit {

  @Output() onEventCompleted: EventEmitter<any> = new EventEmitter();

  query:string='';
  selectedTab:string='';
  searchResult:any[]=[];
  searchLabel:string='';
  api_url=environment.api_url;

  constructor(
    private _bannerlinkModalService:BannerlinkModalService,
    private _bsModalRef:BsModalRef,
    private http: HttpClient){
    let details = this._bannerlinkModalService.getFormData();
    this.selectedTab = details.selectedTab;
    if(this.selectedTab=='OTC_CATEGORY'){
      this.searchLabel = 'Category';
    }
    if(this.selectedTab=='BRAND'){
      this.searchLabel = 'Brand';
    }
    if(this.selectedTab=='PRODUCT'){
      this.searchLabel = 'Product';
    }
    if(this.selectedTab=='MEDICINE_KIT'){
      this.searchLabel = 'Medicine Kit';
    }
  }


  ngOnInit(): void {

  }

  selectItem(item:any){
    this.onEventCompleted.emit(item);
    this.closeModal();
  }

  closeModal(){
    this._bsModalRef.hide()
  }

  _getSearchResult(){
    let url = '';

    if(this.selectedTab=='OTC_CATEGORY'){
      url='api/admin/categories/all?search='+this.query;
    }else if(this.selectedTab=='BRAND'){
      url='api/admin/brands/all?search='+this.query;
    }else if(this.selectedTab=='PRODUCT'){
      url='api/products/search?search='+this.query;
    }else if(this.selectedTab=='MEDICINE_KIT'){
      url='api/medicine_kits/all?search='+this.query;
    }

    this.http.get(url).subscribe((data:any) => {
      this.searchResult = data;
    }, (err:any) => {
      this.searchResult = [];
    });
  }

}
