import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AttributesViewComponent } from './attributes-view.component';

const routes: Routes = [
  {
    path: '', component: AttributesViewComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadChildren:()=>import('./attributes-info/attributes-info.module').then(cat=>cat.AttributesInfoModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributesViewRoutingModule { }
