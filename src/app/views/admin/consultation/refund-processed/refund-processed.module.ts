import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundProcessedComponent } from './refund-processed.component';
import { RefundProcessedRoutingModule } from './refund-processed-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { BlockUIModule } from 'ng-block-ui';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [RefundProcessedComponent],
  imports: [
    RefundProcessedRoutingModule,
    CommonModule,
    DataTablesModule,
    BlockUIModule.forRoot({message:'Loading ...'})
  ],
  providers:[Helper]
})
export class RefundProcessedModule { }
