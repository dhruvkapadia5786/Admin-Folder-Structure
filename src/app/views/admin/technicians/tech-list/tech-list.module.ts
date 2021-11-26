import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TechListRoutingModule } from './tech-list-routing.module';
import { TechListComponent } from './tech-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { Helper } from 'src/app/services/helper.service';
import { BlockUIModule } from 'ng-block-ui';
import { ChangePasswordModalModule } from 'src/app/components/change-password-modal/change-password-modal.module';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';

@NgModule({
  declarations: [TechListComponent],
  imports: [
    CommonModule,
    TechListRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    ModalModule.forRoot(),
    BlockUIModule.forRoot({
      message: 'Loading...'
    }),
    ChangePasswordModalModule
  ],
  providers: [Helper],
  entryComponents:[ChangePasswordModalComponent]
})
export class TechListModule { }
