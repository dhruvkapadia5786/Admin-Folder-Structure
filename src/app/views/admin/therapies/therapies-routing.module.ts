import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TherapiesComponent } from './therapies.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
     path: '', component: TherapiesComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TherapiesRoutingModule { }
