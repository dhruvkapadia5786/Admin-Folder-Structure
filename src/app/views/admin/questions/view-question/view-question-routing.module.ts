import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewQuestionComponent } from './view-question.component';

const routes: Routes = [
  {
      path: "", component: ViewQuestionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewQuestionRoutingModule { }
