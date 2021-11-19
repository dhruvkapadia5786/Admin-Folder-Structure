import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeSequenceFaqComponent } from './change-sequence-faq.component';
import { ChangeSequenceFaqRoutingModule } from './change-sequence-faq-routing.module';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ChangeSequenceFaqComponent],
  imports: [
    CommonModule,
    SharedModule,
    ChangeSequenceFaqRoutingModule,
    FormsModule,
    MatSelectModule,
    DragDropModule,
    CommonModule
  ]
})
export class ChangeSequenceFaqModule { }
