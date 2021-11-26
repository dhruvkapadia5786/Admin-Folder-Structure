import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoHealthConditionComponent } from './info-health-condition.component';

const routes: Routes = [
  { path: '', component: InfoHealthConditionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoHealthConditionRoutingModule { }
