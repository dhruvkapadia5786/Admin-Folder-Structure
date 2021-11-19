import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeAddressModalComponent } from './change-address-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ChangeAddressModalService } from './change-address-modal.service';

@NgModule({
  declarations: [ChangeAddressModalComponent],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
			preventDuplicates: true
		}),
    FormsModule,ReactiveFormsModule
  ],
  providers: [ChangeAddressModalService],
  exports:[ChangeAddressModalComponent]
})
export class ChangeAddressModalModule { }
