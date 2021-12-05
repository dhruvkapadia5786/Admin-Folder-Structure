import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewMedicineKitsComponent } from './view-medicine-kits.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : ViewMedicineKitsComponent, canActivate : [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./info-medicine-kit/info-medicine-kit.module').then(MK=>MK.InfoMedicineKitModule) },
      { path: 'question-list', loadChildren:()=>import('../../questions/questions-list/questions-list.module').then(QL=>QL.QuestionsListModule) },
      { path: 'question-sequence', loadChildren:()=>import('../../questions/change-sequence/change-sequence.module').then(CS=>CS.ChangeSequenceModule) },
      { path: 'question-preview', loadChildren:()=>import('../../questions/questions-preview/questions-preview.module').then(QP=>QP.QuestionPreviewModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMedicineKitsRoutingModule { }
