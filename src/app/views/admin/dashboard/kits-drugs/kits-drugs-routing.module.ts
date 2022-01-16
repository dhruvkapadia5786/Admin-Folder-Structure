import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KitsDrugsComponent } from './kits-drugs.component';

const routes: Routes = [
  {
    path: '', component: KitsDrugsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitsDrugsRoutingModule { }
