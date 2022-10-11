import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-otc-drugs-list',
  templateUrl: './otc-drugs-list.component.html',
  styleUrls: ['./otc-drugs-list.component.scss']
})
export class OtcDrugsListComponent implements OnInit {
  loading:boolean=false;
  categoriesSubcategoriesList:any[]=[];
  config:any;
	collection:any = { count: 0, data: [] };
	hasMorePages:boolean=false;


  constructor(private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private _cdr:ChangeDetectorRef){
      this.config = {
        filter: {
          CATEGORIES: []
        },
        id:'pagination-controls___otc_order',
        itemsPerPage:24,
        currentPage: 1,
        totalItems: this.collection.count
      };
  }

  ngOnInit() {
    this.getAllCategoriesWithSubcategoriesList();
    this.getAllActiveDrugsByOTCCategory();
  }

  public getAllCategoriesWithSubcategoriesList(){
    this._http.get('api/admin/categories/all').subscribe((data:any) => {
      this.categoriesSubcategoriesList = data;
    }, err => {

    });
  }

  pageChanged(event:any){
    this.config.currentPage = event;
    this.getAllActiveDrugsByOTCCategory();
}

  getAllActiveDrugsByOTCCategory(){
    this.loading=true;
    let url=`api/admin/categories/getProducts`;
    this._http.post(url,{
      filter:this.config.filter,
      page:this.config.currentPage,
      limit:this.config.itemsPerPage
    }).subscribe((resp: any) => {
      this.loading=false;
      this.collection.data  =  resp.data;
      this.collection.count = resp.total;
      this.config.itemsPerPage =  resp.perPage;
      this.config.totalItems = resp.total;
      this.config.currentPage  =  resp.currentPage;
      if(this.config.currentPage>1){
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
      }
      this._cdr.detectChanges();
    },
    (err:any) => {
      this.loading=false;
    });
  }

  goToDetailsPage(productId: any): any {
    this.router.navigate(['admin', 'products', 'view', productId]);
  }

  goToEditDetailsPage(productId: any): any {
    this.router.navigate(['admin', 'products', 'edit', productId]);
  }

  get notSelectedCategories(){
    return this.categoriesSubcategoriesList.filter(({ _id: a }) => !this.config.filter.CATEGORIES.some((b: any) => b === a)).length;
  }


  handleChange(event: string, value: any) {
    this.config.currentPage =1;
    this.getAllActiveDrugsByOTCCategory();
  }

  public handleCheckAll(event:any, flag:any){
    if (flag == 'CATEGORIES'){
      if (event.checked){
        this.config.filter.CATEGORIES = this.categoriesSubcategoriesList.map(({_id}) => _id);
      } else {
        this.config.filter.CATEGORIES = [];
      }
    }
    this.config.currentPage =1;
    this.getAllActiveDrugsByOTCCategory();
  }

  getProductImage(imageName:string){
    return environment.api_url+imageName;
  }

}
