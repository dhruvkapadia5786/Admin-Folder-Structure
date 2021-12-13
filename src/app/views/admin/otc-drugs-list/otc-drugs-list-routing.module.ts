import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtcDrugsListComponent } from './otc-drugs-list.component';

const routes: Routes = [{
  path:'',component:OtcDrugsListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtcDrugsListRoutingModule { }
