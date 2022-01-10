import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ContactlensesProductsRoutingModule } from './contactlenses-products-routing.module';
import { ContactlensesProductsComponent } from './contactlenses-products.component';
import { FormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [ContactlensesProductsComponent],
  imports: [
    SharedModule,
    FormsModule,
    MatCheckboxModule, MatSelectModule,
    NgxPaginationModule,
    ContactlensesProductsRoutingModule
  ],
  providers:[Helper]
})
export class ContactlensesProductsModule { }
