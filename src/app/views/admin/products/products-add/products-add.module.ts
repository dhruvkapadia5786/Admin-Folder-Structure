import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsAddRoutingModule } from './products-add-routing.module';
import { ProductsAddComponent } from './products-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LensParametersModalModule } from '../lens-parameters-modal/lens-parameters-modal.module';
import { LensParametersModalComponent } from '../lens-parameters-modal/lens-parameters-modal.component';
import { SelectOtcSubcategoryModalModule } from '../select-otc-subcategory-modal/select-otc-subcategory-modal.module';
import { SelectOtcSubcategoryModalComponent } from '../select-otc-subcategory-modal/select-otc-subcategory-modal.component';
import { BannerlinkModalModule } from '../../banner-sets/bannerlink-modal/bannerlink-modal.module';
import { BannerlinkModalComponent } from '../../banner-sets/bannerlink-modal/bannerlink-modal.component';

@NgModule({
  declarations: [
    ProductsAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    NgxMatSelectSearchModule,
    ModalModule.forRoot(),
    SelectOtcSubcategoryModalModule,
    BannerlinkModalModule,
    LensParametersModalModule,
    ProductsAddRoutingModule
  ],
  entryComponents:[LensParametersModalComponent,SelectOtcSubcategoryModalComponent,BannerlinkModalComponent],
  providers:[Helper]
})
export class ProductsAddModule { }
