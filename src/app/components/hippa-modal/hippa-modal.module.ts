import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HippaModalComponent } from './hippa-modal.component';
import { HippaModalService } from './hippa-modal.service';



@NgModule({
  declarations: [HippaModalComponent],
  imports: [
    CommonModule
  ],
  providers:[HippaModalService],
  exports:[HippaModalComponent]
})
export class HippaModalModule { }
