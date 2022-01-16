import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerSetListRoutingModule } from './banner-set-list-routing.module';
import { BannerSetListComponent } from './banner-set-list.component';
import { BlockUIModule } from 'ng-block-ui';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    BannerSetListComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    BlockUIModule.forRoot({
      message:'Loading ...'
    }),
    BannerSetListRoutingModule
  ]
})
export class BannerSetListModule { }
