import { Component, OnInit,Output,EventEmitter,ChangeDetectorRef,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NcpdpDrugFormsService} from './ncpdp-drug-forms.service';

import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { mergeMap } from 'rxjs/operators';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-ncpdp-drug-forms',
  templateUrl: './ncpdp-drug-forms.component.html',
  styleUrls: ['./ncpdp-drug-forms.component.scss']
})
export class NcpdpDrugFormsComponent implements OnInit {

  @Output() selectedDrug: EventEmitter<any> = new EventEmitter();

  api_called:boolean=false;
  searchKeyword:string='';
  searching:boolean=false;
  NameNDCSearchResult:any;
  searchResult:any;

  // drug auto complete
  asyncSelectedDrug: string='';
  typeaheadLoadingDrug: boolean=false;
  typeaheadNoDrugResults: boolean=false;
  dataSourceDrug: Observable<any>;

  constructor(
    private _http: HttpClient,
    private _ncpdpDrugFormsService:NcpdpDrugFormsService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
     	// drug search auto complete
		this.dataSourceDrug = Observable.create((observer: any) => {
			observer.next(this.asyncSelectedDrug);
      }).pipe(mergeMap((token: string) => this.filterDrugResults(token)));

  }

  ngOnInit() {
  }

  async filterDrugResults(token: string) {
    return this._ncpdpDrugFormsService.getAllNCPDPdrugForms(token).then((data:any)=>{
      return data;
    });
  }

  changeTypeaheadLoadingDrug(e: boolean): void {
    this.typeaheadLoadingDrug = e;
  }

  typeaheadOnSelectDrug(e: TypeaheadMatch): void {
      this.asyncSelectedDrug = e.item.ncpdp_preferred_term;
      this.selectedDrug.emit(e.item);
  }

  searchForNameNDC(searchValue:string){
    if(searchValue && searchValue.length == 0 ){return };
    this.api_called=true;
    this.searching=false;
    this.NameNDCSearchResult='';
    this._changeDetectorRef.detectChanges();
  }

}
