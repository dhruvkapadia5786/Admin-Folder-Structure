import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionEditComponent } from './question-edit.component';

const routes: Routes = [
  {
    path: '', component: QuestionEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionEditRoutingModule { }
