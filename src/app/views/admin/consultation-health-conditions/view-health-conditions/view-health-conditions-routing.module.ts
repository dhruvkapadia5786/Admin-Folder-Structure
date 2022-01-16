import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ViewHealthConditionsComponent } from './view-health-conditions.component';

const routes: Routes = [
  {
    path: '', component : ViewHealthConditionsComponent, canActivate : [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./info-health-condition/info-health-condition.module').then(info=>info.InfoHealthConditionModule) },
      { path: 'question-list', loadChildren:()=>import('../../questions/questions-list/questions-list.module').then(QL=>QL.QuestionsListModule) },
      { path: 'question-sequence', loadChildren:()=>import('../../questions/change-sequence/change-sequence.module').then(CS=>CS.ChangeSequenceModule) },
      { path: 'question-preview', loadChildren:()=>import('../../questions/questions-preview/questions-preview.module').then(QP=>QP.QuestionPreviewModule) },
      { path: 'consultations-list', loadChildren:()=>import('../../consultation/consultation-list/consultation-list.module').then(CS=>CS.ConsultationListModule) }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewHealthConditionsRoutingModule { }
