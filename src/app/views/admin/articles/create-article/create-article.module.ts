import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEditorModule } from 'ngx-editor';
import { CreateArticleRoutingModule } from './create-article-routing.module';
import { CreateArticleComponent } from './create-article.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CreateArticleComponent],
  imports: [
    CommonModule,
    SharedModule,
    CreateArticleRoutingModule,
    MatCheckboxModule,
    NgxEditorModule,
    MatSelectModule
  ]
})
export class CreateArticleModule { }
