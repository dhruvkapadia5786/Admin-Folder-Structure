import { Component, OnInit, ViewChild,ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Helper } from '../../../../services/helper.service';
import Hashids from 'hashids';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DoctorListComponent implements OnInit {
  doctorTableData: any = { count: 0, data: [] };
  doctor_config:any = {
    itemsPerPage:10,
    currentPage: 1,
    totalItems: this.doctorTableData.count,
    filter: {
      ST: []
    }
  };

  stateList:any[] = [];
  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    public _helper: Helper,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
		this.doctor_config = {
			itemsPerPage:10,
			currentPage: 1,
      totalItems: this.doctorTableData.count,
      filter: {
        ST: []
      }
    };
    this.getDoctorList(this.doctor_config.currentPage,this.doctor_config.itemsPerPage,'created_at',-1);
    this.getAllFilterList();
  }

  ngOnInit() {}

  getDoctorList(page:number,limit:number,sortBy:string='created_at',sortOrder:any=-1,search:string='',filter:any=this.doctor_config.filter){
    let body = {
      page: page,
      limit: limit,
      search: search,
      ST: filter.ST
    }
    this._http.post<any>(`api/doctors/list`, body).subscribe((resp) => {
				this.doctorTableData.data = resp.data;
				this.doctorTableData.count = resp.total;
				this.doctor_config.itemsPerPage = resp.perPage;
				this.doctor_config.totalItems = resp.total;
				this.doctor_config.currentPage = resp.currentPage;
				if(page>1){
					window.scrollTo({
						top: 0,
            behavior: 'smooth'
					});
				}
			},err=>{
			});
  }

  getAllFilterList() {
    // states
    this._http.get<any>('api/system_states/all').subscribe((resp) => {
      this.stateList = resp;
    },err=>{
    });
  }

  /* Handle Check all */
  public handleCheckAll (event:any, flag:any) {
    if (flag == 'ST') {
      if (event.checked) {
        this.doctor_config.filter.ST = this.stateList.map(({_id}) => _id);
      } else {
        this.doctor_config.filter.ST = [];
      }
    }
    this.getDoctorList(this.doctor_config.currentPage,this.doctor_config.itemsPerPage,'created_at',-1,'',this.doctor_config.filter);
  }

  /* Handle Partial check all */
  get notSelectedStates () {
    return this.stateList.filter(({ id: a }) => !this.doctor_config.filter.ST.some((b: any) => b === a)).length
  }

  handleChange(eventName: any, event: any) {
    event = typeof event == 'object' ? event.target.value : event;

    if (eventName == 'SEARCH') {
      this.getDoctorList(this.doctor_config.currentPage,this.doctor_config.itemsPerPage,'created_at',-1, event);
    } else if (eventName == 'LIMIT' && event) {
      this.doctor_config.itemsPerPage = event
      this.getDoctorList(this.doctor_config.currentPage,event,'created_at',-1);
    } else if(eventName == 'ST') {
      this.getDoctorList(this.doctor_config.currentPage,this.doctor_config.itemsPerPage,'created_at',-1,'',this.doctor_config.filter);
    }
  }

  getFormattedValue(value: string) {
    return value.split('_').map(item => item.toLocaleLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase())).join(' ')
  }

  pageChanged(event:any){
			this.doctor_config.currentPage = event;
      this.getDoctorList(this.doctor_config.currentPage,this.doctor_config.itemsPerPage,'created_at',-1);
	}

  goToDetailsPage(doctorID: any): any {
    this.router.navigate(['admin', 'doctors', 'view', doctorID]);
  }

  goToEditPage(doctorEditID: any): any {
    this.router.navigate(['admin', 'doctors', 'edit', doctorEditID]);
  }

  goToPasswordChangePage(doctorChangePasswordID: any): any {
    const hashids = new Hashids('', 10);
    const hashid = hashids.encode(doctorChangePasswordID);
    this.router.navigate(['admin', 'changePassword', hashid]);
  }

}
