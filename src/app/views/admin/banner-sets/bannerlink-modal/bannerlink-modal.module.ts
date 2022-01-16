import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerlinkModalComponent } from './bannerlink-modal.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    BannerlinkModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports:[BannerlinkModalComponent]
})
export class BannerlinkModalModule { }
