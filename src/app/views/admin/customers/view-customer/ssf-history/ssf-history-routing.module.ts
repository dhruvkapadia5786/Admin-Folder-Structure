import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SsfHistoryComponent } from './ssf-history.component';
import { AuthGuard } from '../../../../../guards/auth.guard';

const routes: Routes = [
  {
    path :'', component : SsfHistoryComponent,canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SsfHistoryRoutingModule { }
