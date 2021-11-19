import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadMediaModalComponent } from './upload-media-modal.component';
import { UploadMediaModalService } from './upload-media-modal.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UploadMediaModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[UploadMediaModalComponent],
  providers:[UploadMediaModalService]
})
export class UploadMediaModalModule { }
