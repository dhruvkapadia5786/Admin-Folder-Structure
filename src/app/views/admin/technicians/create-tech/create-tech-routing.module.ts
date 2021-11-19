import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateTechComponent } from './create-tech.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : CreateTechComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateTechRoutingModule { }
