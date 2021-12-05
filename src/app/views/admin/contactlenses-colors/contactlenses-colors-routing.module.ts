import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactlensesColorsComponent } from './contactlenses-colors.component';

const routes: Routes = [
  {
    path: '', 
    component:ContactlensesColorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactlensesColorsRoutingModule { }
