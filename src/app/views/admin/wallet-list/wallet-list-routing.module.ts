import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletListComponent } from './wallet-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
     path: '', component: WalletListComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WalletListRoutingModule { }
