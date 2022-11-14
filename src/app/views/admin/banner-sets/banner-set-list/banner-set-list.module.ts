import { NgModule } from '@angular/core';

import { BannerSetListRoutingModule } from './banner-set-list-routing.module';
import { BannerSetListComponent } from './banner-set-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BannerSetListComponent
  ],
  imports: [
    SharedModule,
    BannerSetListRoutingModule
  ]
})
export class BannerSetListModule { }
