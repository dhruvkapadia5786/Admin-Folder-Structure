import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentCategoriesComponent } from './comment-categories.component';
import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: CommentCategoriesComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentCategoriesRoutingModule { }
