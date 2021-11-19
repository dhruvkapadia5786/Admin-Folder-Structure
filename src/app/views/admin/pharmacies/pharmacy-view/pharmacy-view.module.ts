import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskModule } from 'ngx-mask';

import { PharmacyViewRoutingModule } from './pharmacy-view-routing.module';
import { PharmacyDetailsComponent } from './pharmacy-details/pharmacy-details.component';
import { PharmacyViewComponent } from './pharmacy-view.component';

import { DataTablesModule } from 'angular-datatables';
import { ImagePreviewModule } from '../../../../shared/image-preview/image-preview.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [PharmacyViewComponent, PharmacyDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTabsModule,
    NgxMaskModule,
    DataTablesModule,
    ImagePreviewModule,
    LightboxModule,
    NgxPaginationModule,
    PharmacyViewRoutingModule
  ]
})
export class PharmacyViewModule { }
