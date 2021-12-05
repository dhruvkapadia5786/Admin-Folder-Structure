import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-otc-category-info',
  templateUrl: './otc-category-info.component.html',
  styleUrls: ['./otc-category-info.component.scss']
})
export class OtcCategoryInfoComponent implements OnInit {

  categoryId: any;
  OTCCategoryDetails:any;

  constructor(
    public http: HttpClient,
    private route: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef){
      let activeRoute:any = this.route;
      if(activeRoute){
         this.categoryId = activeRoute.parent.parent.snapshot.paramMap.get('id');
      }
  }

  ngOnInit(){
    this.getOTCCategoryDetails();
  }

  getOTCCategoryDetails() {
    const url = 'api/otc_categories/view/' + this.categoryId;
    this.http.get(url).subscribe((res: any) => {
         this.OTCCategoryDetails = res;
        this._changeDetectorRef.detectChanges();
      }, err => {

      });
  }
}
