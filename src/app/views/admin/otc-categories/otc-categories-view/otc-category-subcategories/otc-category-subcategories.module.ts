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

@NgModule({
  declarations: [OtcCategorySubcategoriesComponent],
  imports: [
    SharedModule,
    DataTablesModule,
    MatTabsModule,MatRadioModule,MatCheckboxModule, MatSelectModule,
    OtcCategorySubcategoriesRoutingModule
  ],
  providers:[Helper]
})
export class OtcCategorySubcategoriesModule { }
