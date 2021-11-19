import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CountryRoutingModule } from './countries-routing.module';
import { CountryComponent } from './countries.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {CountryService} from './countries.service'
import { BlockUIModule } from 'ng-block-ui';

import { CountryAddEditModalComponent } from './country-add-edit-modal/country-add-edit-modal.component';
import { CountryAddEditModalModule } from './country-add-edit-modal/country-add-edit-modal.module';
import { CountryAddEditModalService } from './country-add-edit-modal/country-add-edit-modal.service';
import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [CountryComponent],
  imports:[
    CommonModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    MatCheckboxModule,
    CountryRoutingModule,
    ModalModule.forRoot(),
    CountryAddEditModalModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[CountryService,BsModalService,CountryAddEditModalService],
  entryComponents: [CountryAddEditModalComponent]
})
export class CountryModule { }
