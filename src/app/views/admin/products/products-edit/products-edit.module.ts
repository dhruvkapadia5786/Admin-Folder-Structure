import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsEditRoutingModule } from './products-edit-routing.module';
import { ProductsEditComponent } from './products-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from 'src/app/services/helper.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LensParametersModalModule } from '../lens-parameters-modal/lens-parameters-modal.module';
import { LensParametersModalComponent } from '../lens-parameters-modal/lens-parameters-modal.component';
import { SelectOtcSubcategoryModalModule } from '../select-otc-subcategory-modal/select-otc-subcategory-modal.module';
import { SelectOtcSubcategoryModalComponent } from '../select-otc-subcategory-modal/select-otc-subcategory-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    ProductsEditComponent
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
    LensParametersModalModule,
    ProductsEditRoutingModule
  ],
  entryComponents:[LensParametersModalComponent,SelectOtcSubcategoryModalComponent],
  providers:[Helper]
})
export class ProductsEditModule { }
