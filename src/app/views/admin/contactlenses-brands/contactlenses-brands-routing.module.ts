import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactlensesBrandsComponent } from './contactlenses-brands.component';

const routes: Routes = [
  {
    path: '', 
    component:ContactlensesBrandsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactlensesBrandsRoutingModule { }
