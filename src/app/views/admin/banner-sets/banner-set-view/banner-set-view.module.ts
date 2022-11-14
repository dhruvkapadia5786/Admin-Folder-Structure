import { NgModule } from '@angular/core';
import { BannerSetViewRoutingModule } from './banner-set-view-routing.module';
import { BannerSetViewComponent } from './banner-set-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BannerSetViewComponent
  ],
  imports: [
    BannerSetViewRoutingModule,
    SharedModule,
    ImagePreviewModule,
    DragDropModule
  ]
})
export class BannerSetViewModule { }
