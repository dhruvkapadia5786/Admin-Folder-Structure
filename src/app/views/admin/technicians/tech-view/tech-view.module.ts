import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
// import { PipesModule } from 'src/app/pipes/pipes.module';
// import { DatePipe } from '@angular/common';

import { TechViewRoutingModule } from './tech-view-routing.module';
import { TechViewComponent } from './tech-view.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [TechViewComponent],
  imports: [
    SharedModule,
    TechViewRoutingModule,
    MatTabsModule,
    NgxMaskModule,
    DataTablesModule
  ],
  providers: []
})
export class TechViewModule { }
