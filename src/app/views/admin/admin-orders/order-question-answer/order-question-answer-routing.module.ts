import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderQuestionAnswerComponent } from './order-question-answer.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: OrderQuestionAnswerComponent, canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderQuestionAnswerRoutingModule { }
