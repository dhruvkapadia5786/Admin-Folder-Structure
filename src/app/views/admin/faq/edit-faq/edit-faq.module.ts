import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEditorModule } from 'ngx-editor';

import { EditFaqRoutingModule } from './edit-faq-routing.module';
import { EditFaqComponent } from './edit-faq.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [EditFaqComponent],
  imports: [
    CommonModule,
    EditFaqRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    NgxEditorModule,
    MatSelectModule,
  ]
})
export class EditFaqModule { }
