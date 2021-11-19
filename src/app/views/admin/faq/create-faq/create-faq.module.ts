import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEditorModule } from 'ngx-editor';

import { CreateFaqRoutingModule } from './create-faq-routing.module';
import { CreateFaqComponent } from './create-faq.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CreateFaqComponent],
  imports: [
    CommonModule,
    SharedModule,
    CreateFaqRoutingModule,
    MatCheckboxModule,
    NgxEditorModule,
    MatSelectModule
  ]
})
export class CreateFaqModule { }
