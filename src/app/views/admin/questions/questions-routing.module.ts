import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../guards/auth.guard';
import { QuestionsComponent } from './questions.component';

const routes: Routes = [
  {
    path: '', component: QuestionsComponent, canActivate: [AuthGuard],
    children: [
      { path: 'create-question', loadChildren:()=>import('./create-question/create-question.module').then(QC=>QC.CreateQuestionModule) },
      { path: 'edit/:id', loadChildren:()=>import('./question-edit/question-edit.module').then(QE=>QE.QuestionEditModule) },
      { path: 'change-sequence', loadChildren:()=>import('./change-sequence/change-sequence.module').then(CS=>CS.ChangeSequenceModule) },
      { path: 'questions-list', loadChildren:()=>import('./questions-list/questions-list.module').then(QL=>QL.QuestionsListModule) },
      { path: 'view-question/:id', loadChildren:()=>import('./view-question/view-question.module').then(QV=>QV.ViewQuestionModule) },
      { path: 'preview', loadChildren:()=>import('./questions-preview/questions-preview.module').then(QP=>QP.QuestionPreviewModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionsRoutingModule { }
