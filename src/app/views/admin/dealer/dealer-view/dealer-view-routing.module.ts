import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealerViewComponent } from './dealer-view.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: DealerViewComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./dealer-info/dealer-info.module').then(ID=>ID.DealerInfoModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerViewRoutingModule { }
