import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEditorModule } from 'ngx-editor';

import { CreatePolicyRoutingModule } from './create-policy-routing.module';
import { CreatePolicyComponent } from './create-policy.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CreatePolicyComponent],
  imports: [
    CommonModule,
    SharedModule,
    CreatePolicyRoutingModule,
    MatCheckboxModule,
    NgxEditorModule,
    MatSelectModule
  ]
})
export class CreatePolicyModule { }
