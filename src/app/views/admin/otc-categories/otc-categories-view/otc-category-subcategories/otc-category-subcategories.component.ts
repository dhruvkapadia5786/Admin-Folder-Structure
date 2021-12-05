import { Component, OnInit,ChangeDetectorRef, ViewChild, Renderer2, AfterViewInit,OnDestroy } from '@angular/core';
import {OtcCategorySubcategoriesService} from './otc-category-subcategories.service';
import {Helper} from 'src/app/services/helper.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-otc-category-subcategories',
  templateUrl: './otc-category-subcategories.component.html',
  styleUrls: ['./otc-category-subcategories.component.scss']
})
export class OtcCategorySubcategoriesComponent implements OnInit,AfterViewInit,OnDestroy {
  CategoryTableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  categoryId: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _http: HttpClient,
    private router: Router,
    private _renderer: Renderer2,
    private _helper:Helper,
    private _changeDetectorRef: ChangeDetectorRef,
    private _otcCategoriesService:OtcCategorySubcategoriesService){

      let activeRoute:any = this.route;
      if(activeRoute){
        this.categoryId = activeRoute.parent.parent.snapshot.paramMap.get('id');
      }

      this.getDTOptions();
  }

  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
    /* $(window).on('resize', () => {
      this.rerender();
    }); */
  }

  openModal(modal:any){

  }


  getDTOptions(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      paging: true,
      serverSide: true,
      // processing: true,
      search: true,
      searching: true,
      autoWidth: true,
      ordering: true,
      order: [[2, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {
        this.blockDataTable.start();
        this._http
          .post<any>(
            'api/v1/admin/otc-categories/all-subcategories-by-category/'+this.categoryId,
            dataTablesParameters,
            {})
          .subscribe((resp) => {
            this.CategoryTableData = resp.data;
            this.blockDataTable.stop();
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: resp.data
            });
          });
      },
      columns: [
        {
          data:'image',
          title: 'Image',
          orderable: false,
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              let url = environment.api_url + data.substring(3);
              return `<img src=${url} height="80" width="80" />`;
            } else {
              return ``;
            }
          }
        },
        {
          data: 'name',
          title: 'OTC SubCategory Name',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'is_active',
          title: 'Active',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></img>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          data: 'is_coming_soon',
          title: 'Coming Soon',
          className: 'text-center  font-weight-normal',
          render: (data) => {
            if (data) {
              return `<i class="fa fa-check text-success"></img>`;
            } else {
              return `<i class="fa fa-times text-danger"></i>`;
            }
          }
        },
        {
          title: 'Action',
          className: 'text-center  font-weight-normal',
          render: function (data: any, type: any, full: any) {
            return `<button type="button" class="btn btn-sm btn-primary m-0"  categoryEditId="${full.id}">Edit</button>`;
          },
          orderable: false
        }
      ]
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  listenerFn:any;
  ngAfterViewInit(): void {
    this.dtTrigger.next();

    this.listenerFn = this._renderer.listen('document', 'click', (event:any) => {
      if (event.target.hasAttribute('categoryEditId')) {
       let obj:any=this.CategoryTableData.find((cat:any)=> cat._id==event.target.getAttribute('categoryEditId'));

      }else{

      }
    });

  }

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		if(this.dtTrigger){
			this.dtTrigger.unsubscribe();
    }
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
      });
    }
    if(this.blockDataTable){this.blockDataTable.unsubscribe();}
    this.listenerFn();
	}


}
