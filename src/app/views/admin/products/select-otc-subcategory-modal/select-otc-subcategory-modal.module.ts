import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectOtcSubcategoryModalComponent } from './select-otc-subcategory-modal.component';
import {SelectOtcSubcategoryModalService} from './select-otc-subcategory-modal.service';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [SelectOtcSubcategoryModalComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    FormsModule,ReactiveFormsModule,
  ],
  exports:[SelectOtcSubcategoryModalComponent],
  providers:[SelectOtcSubcategoryModalService]
})
export class SelectOtcSubcategoryModalModule { }
