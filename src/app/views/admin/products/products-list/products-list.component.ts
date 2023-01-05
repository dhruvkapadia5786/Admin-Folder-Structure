import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/services/helper.service';
import { CurrencyPipe  } from '@angular/common';
import {environment} from 'src/environments/environment';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, AfterViewInit, OnDestroy {
  productCategoryList:any[]=[];
  productSubscriptionPlanList:any[]=[];
  productStatusList:any[]=[
    {
      name:"Draft",
      value:"draft"
    },
    {
      name:"Under review",
      value:"under_review"
    },
    {
      name:"Published",
      value:"published"
    },
    {
      name:"Rejected",
      value:"rejected"
    },
    {
      name:"update required",
      value:"update_required"
    },
    {
      name:"deleted",
      value:"deleted"
    }
  ];

  shaftList:any[]=['Regular','Stiff','Extra Stiff','Flex','Senior'];
  grip_conditionList:any[]=['Regular','Stiff','Extra Stiff','Flex','Senior'];
  article_conditionList:any[]=['Regular','Stiff','Extra Stiff','Flex','Senior'];
  handednessList:any[]=['Left','Right'];
  genderList:any[]=['Men', 'Women', 'Junior'];
  experience_levelList:any[]=['Beginner', 'Intermediate', 'Advanced'];

  productsList: any[] = [];
  product_config:any = {
    filter: {
      CATEGORY: [],
      SUBSCRIPTION_PLAN:[],
      USER_ID:'',
      STATUS:[],
      SHAFT:[],
      GRIP_CONDITION:[],
      ARTICAL:[],
      HANDEDNESS:[],
      GENDER:[],
      EXPERIENCE:[]
    }
  };
  showHeader:boolean=true;

  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  sellerDealerId:any;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private router: Router,
    public _helper: Helper,
    private cp:CurrencyPipe,
    private _renderer: Renderer2){

     let activeRoute:any=this.route;
     this.sellerDealerId = activeRoute.parent.parent.snapshot.paramMap.get('id') ? activeRoute.parent.parent.snapshot.paramMap.get('id') : null;
     if(this.sellerDealerId){
       this.product_config.filter.USER_ID = this.sellerDealerId;
       this.showHeader = false;
     }
     this.getAllCategories();
     this.getAllSubscriptionPlans();
     this.getDTOptions();
  }

  ngOnInit(): void {
    $.fn.dataTable.ext.errMode = 'none';
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();
    let that=this;
    this.listenerFn = this._renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute('productID')) {
        that.goToDetailsPage(event.target.getAttribute('productID'));
      }
      if (event.target.hasAttribute('productEditId')) {
        that.goToEditPage(event.target.getAttribute('productEditId'));
      }
    });
  }

  goToDetailsPage(productID: any): any {
    this.router.navigate(['admin', 'products', 'view', productID]);
  }

  goToEditPage(productEditId: any): any {
    this.router.navigate(['admin', 'products', 'edit', productEditId]);
  }

  
  public getAllCategories(){
    const url = 'api/admin/categories/all';
    this._http.get(url).subscribe((data: any) => {
       this.productCategoryList=data;
    },
    (err:any) => {

    });
  }

  public getAllSubscriptionPlans(){
    const url = 'api/admin/subscription_plans/all?role=seller';
    this._http.get(url).subscribe((data: any) => {
       this.productSubscriptionPlanList=data;
    },
    (err:any) => {

    });
  }

  handleChange(event: string, value: any) {
    $('#productsList').DataTable().ajax.reload();
  }

  public handleCheckAll(event:any, flag:any) {
    if (flag == 'CATEGORY'){
      if (event.checked){
        this.product_config.filter.CATEGORY = this.productCategoryList.slice().map((item:any)=>item.id);
      } else {
        this.product_config.filter.CATEGORY = [];
      }
    }
    if (flag == 'SUBSCRIPTION_PLAN'){
      if (event.checked){
        this.product_config.filter.SUBSCRIPTION_PLAN = this.productSubscriptionPlanList.slice().map((item:any)=>item.id);
      } else {
        this.product_config.filter.SUBSCRIPTION_PLAN = [];
      }
    }
    if (flag == 'STATUS'){
      if (event.checked){
        this.product_config.filter.STATUS = this.productStatusList.slice().map((item:any)=>item.value);
      } else {
        this.product_config.filter.STATUS = [];
      }
    }
    if (flag == 'SHAFT'){
      if (event.checked){
        this.product_config.filter.SHAFT = this.shaftList;
      } else {
        this.product_config.filter.SHAFT = [];
      }
    }
    if (flag == 'GRIP_CONDITION'){
      if (event.checked){
        this.product_config.filter.GRIP_CONDITION = this.grip_conditionList;
      } else {
        this.product_config.filter.GRIP_CONDITION = [];
      }
    }
    if (flag == 'ARTICAL'){
      if (event.checked){
        this.product_config.filter.ARTICAL = this.article_conditionList;
      } else {
        this.product_config.filter.ARTICAL = [];
      }
    }
    if (flag == 'HANDEDNESS'){
      if (event.checked){
        this.product_config.filter.HANDEDNESS = this.handednessList;
      } else {
        this.product_config.filter.HANDEDNESS = [];
      }
    }
    if (flag == 'GENDER'){
      if (event.checked){
        this.product_config.filter.GENDER = this.genderList;
      } else {
        this.product_config.filter.GENDER = [];
      }
    }
    if (flag == 'EXPERIENCE'){
      if (event.checked){
        this.product_config.filter.EXPERIENCE = this.experience_levelList;
      } else {
        this.product_config.filter.EXPERIENCE = [];
      }
    }
    this.rerender();
  }

  get notSelectedStutus () {
    return this.productStatusList.filter((item:any) => !this.product_config.filter.STATUS.some((b: any) => b === item.value)).length
  }

  get notSelectedCategory(){
    return this.productCategoryList.filter((item:any) => !this.product_config.filter.CATEGORY.some((b: any) => b === item)).length;
  }

  get notSelectedSubscriptionPlan(){
    return this.productSubscriptionPlanList.filter((item:any) => !this.product_config.filter.SUBSCRIPTION_PLAN.some((b: any) => b === item)).length;
  }
  
  get notSelectedShaft () {
    return this.shaftList.filter((item:any) => !this.product_config.filter.SHAFT.some((b: any) => b === item)).length
  }

  get notSelectedGripCond () {
    return this.grip_conditionList.filter((item:any) => !this.product_config.filter.GRIP_CONDITION.some((b: any) => b === item)).length
  }

  get notSelectedArticleCond () {
    return this.article_conditionList.filter((item:any) => !this.product_config.filter.ARTICAL.some((b: any) => b === item)).length
  }

  get notSelectedHandedness () {
    return this.handednessList.filter((item:any) => !this.product_config.filter.HANDEDNESS.some((b: any) => b === item)).length
  }

  get notSelectedGender () {
    return this.genderList.filter((item:any) => !this.product_config.filter.GENDER.some((b: any) => b === item)).length
  }

  get notSelectedExperience () {
    return this.experience_levelList.filter((item:any) => !this.product_config.filter.EXPERIENCE.some((b: any) => b === item)).length
  }


  clearFilter() {
    this.product_config = {filter: {
      CATEGORY:[],
      SUBSCRIPTION_PLAN:[],
      USER_ID:'',
      STATUS:[], 
      SHAFT:[],
      GRIP_CONDITION:[],
      ARTICAL:[],
      HANDEDNESS:[],
      GENDER:[],
      EXPERIENCE:[]
    }}
    $('#productsList').DataTable().ajax.reload();
  }

  ngOnDestroy(){
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
    if(this.blockDataTable){this.blockDataTable.unsubscribe();}
    this.listenerFn();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  getDTOptions(){
    this.blockDataTable.start();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[1, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
       dataTablesParameters.filter = {}
       dataTablesParameters.filter.CATEGORY =  this.product_config.filter.CATEGORY;
       dataTablesParameters.filter.SUBSCRIPTION_PLAN = this.product_config.filter.SUBSCRIPTION_PLAN;
       dataTablesParameters.filter.USER_ID =  this.product_config.filter.USER_ID  ?  this.product_config.filter.USER_ID: undefined;
       dataTablesParameters.filter.STATUS =  this.product_config.filter.STATUS;
      dataTablesParameters.filter.SHAFT=  this.product_config.filter.SHAFT;
      dataTablesParameters.filter.GRIP_CONDITION=  this.product_config.filter.GRIP_CONDITION;
      dataTablesParameters.filter.ARTICAL=  this.product_config.filter.ARTICAL;
      dataTablesParameters.filter.HANDEDNESS=  this.product_config.filter.HANDEDNESS;
      dataTablesParameters.filter.GENDER=  this.product_config.filter.GENDER;
      dataTablesParameters.filter.EXPERIENCE=  this.product_config.filter.EXPERIENCE;

        this._http
          .post<any>(
            'api/admin/products/list',
            dataTablesParameters,
            {}
          )
          .subscribe((resp:any) => {
            this.blockDataTable.stop();
            this.productsList = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          },(error:any)=>{
            this.blockDataTable.stop();
            callback({
              recordsTotal: 0,
              recordsFiltered:0,
              data:[]
            });
          });
      },
      columns: [
        {
          data:'image',
          title: 'Image',
          orderable: false,
          className: 'text-left  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return `<a href="javascript:void(0);" productID=${full.id}><img src='${environment.api_url + data}' height="100" width="100" /></>`;
            } else {
              return ``;
            }
          }
        },
        {
          data: 'name',
          title: 'Product Name',
          className: 'text-left  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return `<a href="javascript:void(0);" productID=${full.id}>${data}</a>`
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'model',
          title: 'Model',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'category_name',
          title: 'Category',
          className: 'text-left  font-weight-normal'
        },

        {
          data: 'brand_name',
          title: 'Brand',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'status',
          title: 'Status',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return this._helper.getProductStatus(data);
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'has_subscription',
          title: 'Has Subscription',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'subscription_plan_name',
          title: 'Subscription Plan',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'subscription_status',
          title: 'Subscription Status',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data=='active') {
              return '<span class="badge badge-success">Active</span>'
            }
            else if (data=='inactive') {
              return '<span class="badge badge-dark">Inactive</span>'
            }
            else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'created_by',
          title: 'Created by',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'rating_count',
          title: 'Nos. Ratings',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'average_rating',
          title: 'Avg Rating',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'sold_count',
          title: 'Sold Count',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'total_sales',
          title: 'Total Sales',
          className: 'text-left  font-weight-normal'
        },

        {
          data: 'regular_price',
          title: 'Regular Price',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return this.cp.transform(data,full.currency);
            } else {
              return '<span>-</span>';
            }
          },
        },
        {
          data: 'sale_price',
          title: 'Sale Price',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return this.cp.transform(data,full.currency);
            } else {
              return '<span>-</span>';
            }
          },
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'is_featured',
          title: 'Is Featured',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></i>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'shaft',
          title: 'Shaft',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'grip_condition',
          title: 'Grip Condition',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'article_condition',
          title: 'Article Condition',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'handedness',
          title: 'Handedness',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'gender',
          title: 'Gender',
          className: 'text-left  font-weight-normal'
        },
        {
          data:'experience_level',
          title: 'Experience level',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'created_at',
          title: 'Created At',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'DD/MM/YYYY HH:mm');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'subscription_activation_date',
          title: 'Subscription Activate Date',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'DD/MM/YYYY HH:mm');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          data: 'subscription_expiry_date',
          title: 'Subscription Expiry Date',
          className: 'text-center  font-weight-normal',
          render: (data: any, type: any, full: any) => {
            if (data) {
              return this._helper.getFormattedDate(data, 'DD/MM/YYYY HH:mm');
            } else {
              return '<span></span>';
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `
            <button class="btn btn-default btn-sm m-0" productID=${full.id}>View</button>
            <br/>
             <button class="btn btn-sm btn-primary m-0" productEditId=${full.id}>Edit</button>`;
          },
          orderable: false
        }
      ]
    };

  }
}
