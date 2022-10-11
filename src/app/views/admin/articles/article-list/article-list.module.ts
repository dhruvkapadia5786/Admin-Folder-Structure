import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListRoutingModule } from './article-list-routing.module';
import { ArticleListComponent } from './article-list.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ArticleListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ArticleListRoutingModule,
    DataTablesModule,
  ]
})
export class ArticleListModule { }
