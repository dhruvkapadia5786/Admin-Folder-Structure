import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { BannerSetsComponent } from './banner-sets.component';

const routes: Routes = [
  {
    path: '', component: BannerSetsComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadChildren:()=> import('./banner-set-list/banner-set-list.module').then(BSL=>BSL.BannerSetListModule) },
      { path: 'view/:id', loadChildren:()=> import('./banner-set-view/banner-set-view.module').then(BSV=>BSV.BannerSetViewModule) },
      { path: 'add', loadChildren:()=> import('./banner-set-create/banner-set-create.module').then(BSC=>BSC.BannerSetCreateModule) },
      { path: 'edit/:id', loadChildren:()=> import('./banner-set-edit/banner-set-edit.module').then(BSE=>BSE.BannerSetEditModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerSetsRoutingModule { }
