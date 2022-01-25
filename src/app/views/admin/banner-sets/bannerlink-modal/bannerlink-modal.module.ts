import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerlinkModalComponent } from './bannerlink-modal.component';
import { FormsModule } from '@angular/forms';
import { BannerlinkModalService } from './bannerlink-modal.service';

@NgModule({
  declarations: [
    BannerlinkModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports:[BannerlinkModalComponent],
  providers:[BannerlinkModalService]
})
export class BannerlinkModalModule { }
