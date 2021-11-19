import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechniciansComponent } from './technicians.component';
import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: TechniciansComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadChildren:()=>import('./tech-list/tech-list.module').then(TL=>TL.TechListModule) },
      { path: 'add', loadChildren:()=>import('./create-tech/create-tech.module').then(TC=>TC.CreateTechModule) },
      { path: 'view/:id', loadChildren:()=>import('./tech-view/tech-view.module').then(TV=>TV.TechViewModule) },
      { path: 'edit/:id', loadChildren:()=>import('./edit-tech/edit-tech.module').then(TE=>TE.EditTechModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechniciansRoutingModule { }
