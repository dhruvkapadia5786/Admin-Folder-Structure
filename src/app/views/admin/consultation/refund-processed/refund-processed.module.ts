import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundProcessedComponent } from './refund-processed.component';
import { RefundProcessedRoutingModule } from './refund-processed-routing.module';
import { BlockUIModule } from 'ng-block-ui';
import { Helper } from 'src/app/services/helper.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { consultationHelper } from 'src/app/services/consultationHelper.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RefundProcessedComponent],
  imports: [
    RefundProcessedRoutingModule,
    CommonModule,
    FormsModule,
    BlockUIModule.forRoot({message:'Loading ...'}),
    NgxPaginationModule
  ],
  providers:[Helper,consultationHelper]
})
export class RefundProcessedModule { }
