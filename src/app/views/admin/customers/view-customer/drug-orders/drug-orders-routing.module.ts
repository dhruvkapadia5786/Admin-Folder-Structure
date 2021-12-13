import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrugOrdersComponent } from './drug-orders.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path :'', component : DrugOrdersComponent,canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrugOrdersRoutingModule { }
