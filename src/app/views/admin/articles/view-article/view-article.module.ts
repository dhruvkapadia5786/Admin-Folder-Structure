import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewArticleRoutingModule } from './view-article-routing.module';
import { ViewArticleComponent } from './view-article.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewArticleComponent],
  imports: [
    CommonModule,
    ViewArticleRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ViewArticleModule { }
