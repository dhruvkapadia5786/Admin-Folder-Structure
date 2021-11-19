import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmaciesComponent } from './pharmacies.component';
import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: PharmaciesComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadChildren:()=>import('./pharmacies-list/pharmacies-list.module').then(PL => PL.PharmaciesListModule) },
      { path: 'add', loadChildren:()=>import('./pharmacy-add/pharmacy-add.module').then(PA => PA.PharmacyAddModule) },
      { path: 'view/:id', loadChildren:()=>import('./pharmacy-view/pharmacy-view.module').then(PV => PV.PharmacyViewModule) },
      { path: 'edit/:id', loadChildren:()=>import('./pharmacy-edit/pharmacy-edit.module').then(PE => PE.PharmacyEditModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaciesRoutingModule { }
