import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmacyViewComponent } from './pharmacy-view.component';
import { PharmacyDetailsComponent } from './pharmacy-details/pharmacy-details.component';

const routes: Routes = [
  { 
    path: '', component: PharmacyViewComponent,
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path:'details' , component:PharmacyDetailsComponent },
      { path:'user-management' , loadChildren:()=>import('./pharmacy-user-management/pharmacy-user-management.module').then(UM=>UM.PharmacyUserManagementModule) },
      { path:'create-user' , loadChildren:()=>import('./pharmacy-user-create/pharmacy-user-create.module').then(UC=>UC.PharmacyUserCreateModule) },
      { path:'edit-user/:userid' , loadChildren:()=>import('./pharmacy-user-create/pharmacy-user-create.module').then(PUC=>PUC.PharmacyUserCreateModule) },
      { path:'view-user/:userid' , loadChildren:()=>import('./pharmacy-user-view/pharmacy-user-view.module').then(PUV=>PUV.PharmacyUserViewModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyViewRoutingModule { }
