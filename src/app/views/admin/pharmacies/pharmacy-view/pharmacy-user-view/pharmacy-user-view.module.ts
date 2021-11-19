import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { BlockUIModule } from 'ng-block-ui';
import { DataTablesModule } from 'angular-datatables';

import { PharmacyUserViewRoutingModule } from './pharmacy-user-view-routing.module';
import { PharmacyUserViewComponent } from './pharmacy-user-view.component';
import { Helper } from 'src/app/services/helper.service';
import { DoumentListModule } from 'src/app/shared/doument-list/doument-list.module';

@NgModule({
  declarations: [PharmacyUserViewComponent],
  imports: [
    CommonModule,
    PipesModule,
    BlockUIModule.forRoot(),
    DataTablesModule,
    DoumentListModule,
    PharmacyUserViewRoutingModule
  ],
  providers: [Helper]
})
export class PharmacyUserViewModule { }
