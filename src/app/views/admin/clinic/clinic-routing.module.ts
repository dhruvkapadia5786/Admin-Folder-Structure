import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicComponent } from './clinic.component';
import {ViewClinicComponent} from './view-clinic/view-clinic.component';
import {EditClinicComponent} from './edit-clinic/edit-clinic.component';
import {ListClinicComponent} from './list-clinic/list-clinic.component';
import { AddClinicComponent } from './add-clinic/add-clinic.component';

const routes: Routes = [
  {
      path: '',component: ClinicComponent,
      children:[
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          {path:'view/:id',component:ViewClinicComponent},
          {path:'edit/:id',component:EditClinicComponent},
          {path:'list',component:ListClinicComponent},
          {path:'add',component:AddClinicComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicRoutingModule { }
