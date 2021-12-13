import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { OtcDrugsListRoutingModule } from './otc-drugs-list-routing.module';
import { OtcDrugsListComponent } from './otc-drugs-list.component';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [OtcDrugsListComponent],
  imports: [
    SharedModule,
    FormsModule,
    MatCheckboxModule, MatSelectModule,
    NgxPaginationModule,
    OtcDrugsListRoutingModule
  ],
  providers:[Helper]
})
export class OtcDrugsListModule { }
