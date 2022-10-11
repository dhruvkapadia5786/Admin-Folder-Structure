import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CategorySubcategoriesRoutingModule } from './category-subcategories-routing.module';
import { CategorySubcategoriesComponent } from './category-subcategories.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import {Helper} from 'src/app/services/helper.service';

import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { SubcategoriesAddEditModalComponent } from '../subcategories-add-edit-modal/subcategories-add-edit-modal.component';
import { SubcategoriesAddEditModalModule } from '../subcategories-add-edit-modal/subcategories-add-edit-modal.module';

@NgModule({
  declarations: [CategorySubcategoriesComponent],
  imports: [
    SharedModule,
    DataTablesModule,
    MatTabsModule,MatRadioModule,MatCheckboxModule, MatSelectModule,
    ModalModule.forRoot(),
    SubcategoriesAddEditModalModule,
    CategorySubcategoriesRoutingModule
  ],
  providers:[Helper,BsModalService],
  entryComponents:[SubcategoriesAddEditModalComponent]
})
export class CategorySubcategoriesModule { }
