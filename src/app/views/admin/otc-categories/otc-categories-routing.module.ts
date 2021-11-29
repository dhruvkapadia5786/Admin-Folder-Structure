import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { OtcCategoriesComponent } from './otc-categories.component';

const routes: Routes = [
  {
    path: '', component: OtcCategoriesComponent, canActivate: [AuthGuard],
    children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', loadChildren:()=>import('./otc-categories-list/otc-categories-list.module').then(OTCList=>OTCList.OtcCategoriesListModule) },
        { path: 'view/:id', loadChildren:()=>import('./otc-categories-view/otc-categories-view.module').then(OTCView=>OTCView.OtcCategoriesViewModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcCategoriesRoutingModule { }
