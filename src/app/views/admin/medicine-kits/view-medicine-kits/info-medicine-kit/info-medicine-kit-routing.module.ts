import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { InfoMedicineKitComponent } from './info-medicine-kit.component';

const routes: Routes = [
  {
    path: '', component : InfoMedicineKitComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoMedicineKitRoutingModule { }
