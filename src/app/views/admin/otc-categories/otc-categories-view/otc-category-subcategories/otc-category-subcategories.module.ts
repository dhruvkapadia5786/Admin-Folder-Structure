import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { OtcCategorySubcategoriesRoutingModule } from './otc-category-subcategories-routing.module';
import { OtcCategorySubcategoriesComponent } from './otc-category-subcategories.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {Helper} from 'src/app/services/helper.service';

import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { OtcSubcategoriesAddEditModalComponent } from '../otc-subcategories-add-edit-modal/otc-subcategories-add-edit-modal.component';
import { OtcSubcategoriesAddEditModalModule } from '../otc-subcategories-add-edit-modal/otc-subcategories-add-edit-modal.module';

@NgModule({
  declarations: [OtcCategorySubcategoriesComponent],
  imports: [
    SharedModule,
    DataTablesModule,
    MatTabsModule,MatRadioModule,MatCheckboxModule, MatSelectModule,
    ModalModule.forRoot(),
    OtcSubcategoriesAddEditModalModule,
    OtcCategorySubcategoriesRoutingModule
  ],
  providers:[Helper,BsModalService],
  entryComponents:[OtcSubcategoriesAddEditModalComponent]
})
export class OtcCategorySubcategoriesModule { }
