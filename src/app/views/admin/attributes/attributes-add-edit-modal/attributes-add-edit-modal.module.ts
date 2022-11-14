import { NgModule } from '@angular/core';
import { AttributesAddEditModalComponent } from './attributes-add-edit-modal.component';
import { AttributesAddEditModalService } from './attributes-add-edit-modal.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AttributesAddEditModalComponent
  ],
  imports: [
    SharedModule
  ],
  providers:[AttributesAddEditModalService],
  exports: [AttributesAddEditModalComponent]
})
export class AttributesAddEditModalModule { }
