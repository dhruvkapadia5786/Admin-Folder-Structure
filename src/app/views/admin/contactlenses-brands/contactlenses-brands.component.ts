import { Component, OnInit,ChangeDetectorRef, ViewChild, Renderer2, AfterViewInit,OnDestroy } from '@angular/core';
import { ContactlensesBrandsService} from './contactlenses-brands.service';
import { DataTableDirective } from 'angular-datatables';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contactlenses-brands',
  templateUrl: './contactlenses-brands.component.html',
  styleUrls: ['./contactlenses-brands.component.scss']
})
export class ContactlensesBrandsComponent implements OnInit, AfterViewInit, OnDestroy {
  TableData = [];
  dtOptions!: DataTables.Settings;
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  @BlockUI('datatable') blockDataTable!: NgBlockUI;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _http: HttpClient,
    private router: Router,
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _brandService:ContactlensesBrandsService){

      this.getDTOptions();

  }
  ngOnInit() {
    $.fn.dataTable.ext.errMode = 'none';
  }

  getDTOptions() {
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
            'api/contact_lens/brands',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            this.TableData = resp.data;
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
          data:'image_url',
          title: 'Image',
          orderable: false,
          className: 'text-left  font-weight-normal',
          render: (data) => {
            if (data) {
              let url = environment.api_url + data;
              return `<img src=${url} height="80" width="80" />`;
            } else {
              return ``;
            }
          }
        },
        {
          data: 'name',
          title: 'Brand Name',
          className: 'text-left  font-weight-normal'
        },
        {
          data: 'slug',
          title: 'Slug',
          className: 'text-center  font-weight-normal'
        },
        {
          data: 'manufacturer_id',
          title: 'Manufacturer Name',
          className: 'text-left  font-weight-normal',
          render: function (data: any, type: any, full: any){
            if (data){
              return `${full.manufacturer_id.name}`;
            }else{
              return '-'
            }
          }
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

    });
  }

  ngOnDestroy(): void {
		// Do not forget to unsubscribe the event
		if (this.dtTrigger) {
			this.dtTrigger.unsubscribe();
    }
    if(this.dtElement && this.dtElement.dtInstance){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
      });
    }
    if (this.blockDataTable) { this.blockDataTable.unsubscribe(); }
    this.listenerFn();
	}

}
