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
      /* { path: 'question-list', loadChildren: '../../questions/questions-list/questions-list.module#QuestionsListModule' },
      { path: 'question-sequence', loadChildren: '../../questions/change-sequence/change-sequence.module#ChangeSequenceModule' },
      { path: 'question-preview', loadChildren: '../../questions/questions-preview/questions-preview.module#QuestionPreviewModule' }, */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMedicineKitsRoutingModule { }
