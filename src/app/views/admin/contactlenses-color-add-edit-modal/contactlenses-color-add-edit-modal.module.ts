import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactlensesColorAddEditModalComponent } from './contactlenses-color-add-edit-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactLensesColorAddEditModalService } from './contactlenses-color-add-edit-modal.service';
import { Helper } from 'src/app/services/helper.service';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [
    ContactlensesColorAddEditModalComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule, ReactiveFormsModule
  ],
  providers:[ContactLensesColorAddEditModalService, Helper],
  exports:[ContactlensesColorAddEditModalComponent]
})
export class ContactlensesColorAddEditModalModule { }
