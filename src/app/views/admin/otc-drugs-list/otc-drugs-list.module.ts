import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { OtcDrugsListRoutingModule } from './otc-drugs-list-routing.module';
import { OtcDrugsListComponent } from './otc-drugs-list.component';

@NgModule({
  declarations: [OtcDrugsListComponent],
  imports: [
    SharedModule,
    OtcDrugsListRoutingModule
  ]
})
export class OtcDrugsListModule { }
