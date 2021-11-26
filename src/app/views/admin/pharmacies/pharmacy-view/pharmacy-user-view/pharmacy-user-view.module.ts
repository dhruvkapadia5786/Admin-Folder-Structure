import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { BlockUIModule } from 'ng-block-ui';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';

import { PharmacyUserViewRoutingModule } from './pharmacy-user-view-routing.module';
import { PharmacyUserViewComponent } from './pharmacy-user-view.component';
import { Helper } from 'src/app/services/helper.service';
import { DoumentListModule } from 'src/app/shared/doument-list/doument-list.module';

import { ChangePasswordModalModule } from 'src/app/components/change-password-modal/change-password-modal.module';
import { ChangePasswordModalComponent } from 'src/app/components/change-password-modal/change-password-modal.component';

@NgModule({
  declarations: [PharmacyUserViewComponent],
  imports: [
    CommonModule,
    PipesModule,
    ModalModule.forRoot(),
    BlockUIModule.forRoot(),
    DataTablesModule,
    DoumentListModule,
    ChangePasswordModalModule,
    PharmacyUserViewRoutingModule
  ],
  providers: [Helper],
  entryComponents: [ChangePasswordModalComponent]
})
export class PharmacyUserViewModule { }
