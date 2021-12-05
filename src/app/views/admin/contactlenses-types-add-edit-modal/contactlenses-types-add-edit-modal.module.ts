import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactlensesTypesAddEditModalComponent } from './contactlenses-types-add-edit-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Helper } from 'src/app/services/helper.service';
import { ContactLensesTypesAddEditModalService } from './contactlenses-types-add-edit-modal.service';



@NgModule({
  declarations: [
    ContactlensesTypesAddEditModalComponent
  ],
  imports: [
   CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  providers:[ContactLensesTypesAddEditModalService, Helper],
  exports:[ContactlensesTypesAddEditModalComponent]
})
export class ContactlensesTypesAddEditModalModule { }
