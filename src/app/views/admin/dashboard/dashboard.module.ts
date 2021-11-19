import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DataTablesModule } from 'angular-datatables';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastrModule } from 'ngx-toastr';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    DashboardRoutingModule,
    ToastrModule.forRoot({
			preventDuplicates: true
		}),
    BlockUIModule.forRoot({
      message:'Loading ...'
    })
  ],
  providers:[DashboardService],
  exports: [RouterModule]
})
export class DashboardModule { }
