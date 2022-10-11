import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttributesInfoComponent } from './attributes-info.component';

const routes: Routes = [
  {
    path:'',component:AttributesInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributesRoutingModule { }
