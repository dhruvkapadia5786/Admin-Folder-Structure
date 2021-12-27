import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrugFormsComponent } from './drugforms.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
     path: '', component: DrugFormsComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrugFormsRoutingModule { }
