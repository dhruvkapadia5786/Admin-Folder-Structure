import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TechViewComponent } from './tech-view.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : TechViewComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechViewRoutingModule { }
