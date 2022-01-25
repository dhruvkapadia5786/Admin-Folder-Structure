import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerSetViewRoutingModule } from './banner-set-view-routing.module';
import { BannerSetViewComponent } from './banner-set-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';


@NgModule({
  declarations: [
    BannerSetViewComponent
  ],
  imports: [
    CommonModule,
    BannerSetViewRoutingModule,
    FormsModule,
    ImagePreviewModule,
    DragDropModule
  ]
})
export class BannerSetViewModule { }
