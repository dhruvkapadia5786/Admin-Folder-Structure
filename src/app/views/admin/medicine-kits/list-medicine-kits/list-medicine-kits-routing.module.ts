import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMedicineKitsComponent } from './list-medicine-kits.component';

const routes: Routes = [
  { path: '', component: ListMedicineKitsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListMedicineKitsRoutingModule { }
