import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MedicineKitsComponent } from './medicine-kits.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: MedicineKitsComponent, canActivate: [AuthGuard],
     children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadChildren:()=>import('./list-medicine-kits/list-medicine-kits.module').then(MK=>MK.ListMedicineKitsModule) },
      { path: 'create', loadChildren:()=>import('./create-medicine-kits/create-medicine-kits.module').then(MK=>MK.CreateMedicineKitsModule) },
      { path: 'view/:kit_id', loadChildren:()=>import('./view-medicine-kits/view-medicine-kits.module').then(MK=>MK.ViewMedicineKitsModule) },
      { path: 'edit/:kit_id', loadChildren:()=>import('./edit-medicine-kits/edit-medicine-kits.module').then(MK=>MK.EditMedicineKitsModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineKitsRoutingModule { }
