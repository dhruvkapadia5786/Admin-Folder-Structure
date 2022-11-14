import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ArticleCategoriesListRoutingModule } from './article-categories-list-routing.module';
import { ArticleCategoriesListComponent } from './article-categories-list.component';

import { ArticleCategoriesAddEditModalComponent } from '../article-categories-add-edit-modal/article-categories-add-edit-modal.component';
import { ArticleCategoriesAddEditModalModule } from '../article-categories-add-edit-modal/article-categories-add-edit-modal.module';

@NgModule({
  declarations: [
    ArticleCategoriesListComponent
  ],
  imports: [
    SharedModule,
    ArticleCategoriesAddEditModalModule,
    ArticleCategoriesListRoutingModule
  ],
  entryComponents: [ ArticleCategoriesAddEditModalComponent]
})
export class ArticleCategoriesListModule { }
