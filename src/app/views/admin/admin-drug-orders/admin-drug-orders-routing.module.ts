import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDrugOrdersComponent } from './admin-drug-orders.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DrugOrdersListComponent } from './drug-orders-list/drug-orders-list.component';
import { DrugOrdersViewComponent } from './drug-orders-view/drug-orders-view.component';
import { RefundRequestedDrugOrdersComponent } from './refund-requested-drug-orders/refund-requested-drug-orders.component';
import { RefundProcessedDrugOrdersComponent } from './refund-processed-drug-orders/refund-processed-drug-orders.component';

const routes: Routes = [
  {
    path: '', component: AdminDrugOrdersComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component:DrugOrdersListComponent  },
      { path: 'view/:id', component:DrugOrdersViewComponent },
      { path: 'refund-requested', component:RefundRequestedDrugOrdersComponent  },
      { path: 'refund-processed', component:RefundProcessedDrugOrdersComponent  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDrugOrdersRoutingModule { }
