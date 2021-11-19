import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchDoctorModalComponent } from './search-doctor-modal.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchDoctorModalService } from './search-doctor-modal.service';

@NgModule({
  declarations: [
    SearchDoctorModalComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[SearchDoctorModalService],
  exports:[SearchDoctorModalComponent]
})
export class SearchDoctorModalModule { }
