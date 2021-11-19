import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechListRoutingModule } from './tech-list-routing.module';
import { TechListComponent } from './tech-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { Helper } from 'src/app/services/helper.service';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [TechListComponent],
  imports: [
    CommonModule,
    TechListRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    BlockUIModule.forRoot({
      message: 'Loading...'
    })
  ],
  providers: [Helper]
})
export class TechListModule { }
