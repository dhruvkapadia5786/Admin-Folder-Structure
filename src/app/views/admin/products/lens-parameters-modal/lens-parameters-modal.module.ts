import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LensParametersModalComponent } from './lens-parameters-modal.component';
import { LensParametersModalService } from './lens-parameters-modal.service';

@NgModule({
  declarations: [
    LensParametersModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    LensParametersModalComponent
  ],
  providers:[LensParametersModalService]
})
export class LensParametersModalModule { }
