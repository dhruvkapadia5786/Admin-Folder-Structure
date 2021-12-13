import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserCartListRoutingModule } from './user-cart-list-routing.module';
import { UserCartListComponent } from './user-cart-list.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module'
import { Helper } from 'src/app/services/helper.service';

@NgModule({
  declarations: [UserCartListComponent],
  imports: [
    CommonModule,
    UserCartListRoutingModule,
    NgxPaginationModule,
    TabsModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
  ],
  providers:[Helper]
})
export class UserCartListModule { }
