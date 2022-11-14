import { NgModule } from '@angular/core';

import { ProductsEditRoutingModule } from './products-edit-routing.module';
import { ProductsEditComponent } from './products-edit.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SelectSubcategoryModalModule } from '../select-subcategory-modal/select-subcategory-modal.module';
import { SelectSubcategoryModalComponent } from '../select-subcategory-modal/select-subcategory-modal.component';
import { BannerlinkModalModule } from '../../banner-sets/bannerlink-modal/bannerlink-modal.module';
import { BannerlinkModalComponent } from '../../banner-sets/bannerlink-modal/bannerlink-modal.component';
import { TextEditorModalModule } from '../../common-components/text-editor-modal/text-editor-modal.module';
import { TextEditorModalComponent } from '../../common-components/text-editor-modal/text-editor-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ProductsEditComponent
  ],
  imports: [
    SharedModule,
    NgxMatSelectSearchModule,
    SelectSubcategoryModalModule,
    BannerlinkModalModule,
    TextEditorModalModule,
    ProductsEditRoutingModule
  ],
  entryComponents:[SelectSubcategoryModalComponent,BannerlinkModalComponent,TextEditorModalComponent]
})
export class ProductsEditModule { }
