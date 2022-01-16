import { NgModule } from '@angular/core';

import { DoctorPrescribedOrdersRoutingModule } from './doctor-prescribed-orders-routing.module';
import { DoctorPrescribedOrdersComponent } from './doctor-prescribed-orders.component';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { orderHelper } from 'src/app/services/orderHelper.service';

@NgModule({
    declarations: [DoctorPrescribedOrdersComponent],
    imports: [
    SharedModule,
        DoctorPrescribedOrdersRoutingModule,
        NgxMaskModule,
        DataTablesModule,
        MatTabsModule
    ],
    exports: [DoctorPrescribedOrdersComponent],
    providers:[orderHelper]
})
export class DoctorPrescribedOrdersModule { }
