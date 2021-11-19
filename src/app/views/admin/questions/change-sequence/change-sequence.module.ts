import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeSequenceComponent } from './change-sequence.component';
import { ChangeSequenceRoutingModule } from './change-sequence-routing.module';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ChangeSequenceComponent],
  imports: [
    CommonModule,
    ChangeSequenceRoutingModule,
    FormsModule,
    MatSelectModule,
    DragDropModule
  ]
})
export class ChangeSequenceModule { }
