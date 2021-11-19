import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { OrdersViewRoutingModule } from './orders-view-routing.module';
import { OrdersViewComponent } from './orders-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap/modal';

import { orderHelper } from 'src/app/services/orderHelper.service';
import { OrderLogsModule } from '../../../../components/order-logs/order-logs.module';
import { OrderQuestionAnswerModule } from '../order-question-answer/order-question-answer.module';
import { ImagePreviewModule } from '../../../../shared/image-preview/image-preview.module';
import { OrderMedicineKitComponent } from '../order-medicine-kit/order-medicine-kit.component';
import { Helper } from 'src/app/services/helper.service';
import { ChangeAddressModalComponent } from 'src/app/components/change-address-modal/change-address-modal.component';
import { ChangeAddressModalModule } from 'src/app/components/change-address-modal/change-address-modal.module';

@NgModule({
  declarations: [OrdersViewComponent, OrderMedicineKitComponent],
  imports: [
    SharedModule,
    OrdersViewRoutingModule,
    MatTabsModule,
    NgxMaskModule,
    DataTablesModule,
    ImagePreviewModule,
    OrderQuestionAnswerModule,
    ModalModule.forRoot(),
    ChangeAddressModalModule,
    OrderLogsModule
  ],
  providers:[orderHelper, Helper],
  entryComponents:[ChangeAddressModalComponent]
})
export class OrdersViewModule { }
