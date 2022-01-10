import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-contactlenses-products',
  templateUrl: './contactlenses-products.component.html',
  styleUrls: ['./contactlenses-products.component.scss']
})
export class ContactlensesProductsComponent implements OnInit {
  loading:boolean=false;
  brandsList:any[]=[];
  lenstypeList:any[]=[];

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
          PRODUCT_TYPE:['LENS','SOLUTION'],
          BRAND_IDS: [],
          LENS_TYPE_IDS: []
        },
        id:'pagination-controls___otc_order',
        itemsPerPage:24,
        currentPage: 1,
        totalItems: this.collection.count
      };
  }

  ngOnInit() {
    this.getBrandList();
    this.getlensTypesList();
    this.getAllActiveDrugsByOTCCategory();
  }

  getBrandList(){
    this._http.get('api/contact_lens/brands').subscribe((data:any) => {
      this.brandsList = data;
    }, (err:any) => {

    });
  }

  getlensTypesList(){
    this._http.get('api/contact_lens/all_types').subscribe((data:any) => {
      this.lenstypeList = data;
    }, (err:any)  => {

    });
  }

  pageChanged(event:any){
    this.config.currentPage = event;
    this.getAllActiveDrugsByOTCCategory();
  }

  getAllActiveDrugsByOTCCategory(){
    this.loading=true;
    let url=`api/contact_lens/getProducts`;
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
    this.router.navigate(['admin', 'products', 'edit', productId]);
  }


  handleChange(event: string, value: any) {
    this.config.currentPage =1;
    this.getAllActiveDrugsByOTCCategory();
  }

  public handleCheckAll(event:any, flag:any){
    if (flag == 'BRAND_IDS'){
      if (event.checked){
        this.config.filter.BRAND_IDS = this.brandsList.map(({_id}) => _id);
      } else {
        this.config.filter.BRAND_IDS = [];
      }
    }
    else if (flag == 'LENS_TYPE_IDS'){
      if (event.checked){
        this.config.filter.LENS_TYPE_IDS = this.lenstypeList.map(({_id}) => _id);
      } else {
        this.config.filter.LENS_TYPE_IDS = [];
      }
    }
    this.config.currentPage =1;
    this.getAllActiveDrugsByOTCCategory();
  }

  getProductImage(imageName:string){
    return environment.api_url+imageName;
  }


  get notSelectedBrand () {
    return this.brandsList.filter(({ id: a }) => !this.config.filter.BRAND_IDS.some((b: any) => b === a)).length;
  }

  get notSelectedlensTypes () {
    return this.lenstypeList.filter(({ id: a }) => !this.config.filter.LENS_TYPE_IDS.some((b: any) => b === a)).length;
  }

}
