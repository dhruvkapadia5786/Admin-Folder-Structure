import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemedicineModalComponent } from './telemedicine-modal.component';
import { TelemedicineModalService } from './telemedicine-modal.service';



@NgModule({
  declarations: [TelemedicineModalComponent],
  imports: [
    CommonModule
  ],
  providers:[TelemedicineModalService],
  exports:[TelemedicineModalComponent]
})
export class TelemedicineModalModule { }
