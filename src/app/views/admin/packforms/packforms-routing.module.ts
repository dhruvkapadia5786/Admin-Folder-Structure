import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackformsComponent } from './packforms.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
     path: '', component: PackformsComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackformsRoutingModule { }
