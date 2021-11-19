import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditTechComponent } from './edit-tech.component';
import { AuthGuard } from '../../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : EditTechComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTechRoutingModule { }
