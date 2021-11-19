import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechListComponent } from './tech-list.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : TechListComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechListRoutingModule { }
