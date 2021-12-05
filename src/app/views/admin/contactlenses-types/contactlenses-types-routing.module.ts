import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactlensesTypesComponent } from './contactlenses-types.component';

const routes: Routes = [
  {
    path: '', 
    component:ContactlensesTypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactlensesTypesRoutingModule { }
