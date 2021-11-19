import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMedicineKitsComponent } from './edit-medicine-kits.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component : EditMedicineKitsComponent, canActivate : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditMedicineKitsRoutingModule { }
