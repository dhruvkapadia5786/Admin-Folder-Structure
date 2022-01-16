import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component :  DashboardComponent, canActivate : [AuthGuard],
    children: [
      { path: '', redirectTo: 'sales-orders', pathMatch: 'full' },
      { path: 'sales-orders', loadChildren:()=>import('./sales-orders/sales-orders.module').then(sales=>sales.SalesOrdersModule) },
      { path: 'kits-drugs', loadChildren:()=>import('./kits-drugs/kits-drugs.module').then(kits=>kits.KitsDrugsModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
