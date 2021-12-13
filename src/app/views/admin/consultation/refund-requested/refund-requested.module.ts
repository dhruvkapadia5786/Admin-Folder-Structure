import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundRequestedComponent } from './refund-requested.component';
import { RefundRequestedRoutingModule } from './refund-requested-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [RefundRequestedComponent],
  imports: [
  RefundRequestedRoutingModule,
    CommonModule,
    DataTablesModule,
    BlockUIModule.forRoot({message:'Loading ...'})
  ],
  providers:[Helper]
})
export class RefundRequestedModule { }
