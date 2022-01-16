import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsentModalComponent } from './consent-modal.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {ConsentModalService} from './consent-modal.service';

@NgModule({
  declarations: [ConsentModalComponent],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule
  ],
  providers: [ConsentModalService],
  exports:[ConsentModalComponent]
})
export class ConsentModalModule { }
