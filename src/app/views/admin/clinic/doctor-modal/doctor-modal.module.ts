import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DoctorModalComponent } from './doctor-modal.component';
import { DoctorModalService } from './doctor-modal.service';
import { Helper } from 'src/app/services/helper.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DoctorModalComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[DoctorModalService, Helper],
  exports:[DoctorModalComponent]
})
export class DoctorModalModule { }
