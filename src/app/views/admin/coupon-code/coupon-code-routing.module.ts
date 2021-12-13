import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponCodeComponent } from './coupon-code.component';

const routes: Routes = [
  {
    path: '', component: CouponCodeComponent,
    children: [
      { path: 'create-coupon-code', loadChildren:()=>import('./create-coupon-code/create-coupon-code.module').then(CreateCC=>CreateCC.CreateCouponCodeModule) },
      { path: 'bulk-create-coupon-code', loadChildren:()=>import('./bulk-create-coupon-code/bulk-create-coupon-code.module').then(CCB=>CCB.BulkCreateCouponCodeModule) },
      { path: 'list-coupon-code', loadChildren:()=>import('./list-coupon-code/list-coupon-code.module').then(CCL=>CCL.ListCouponCodeModule) },
      { path: 'edit-coupon-code/:id', loadChildren:()=>import('./edit-coupon-code/edit-coupon-code.module').then(ECC=>ECC.EditCouponCodeModule) },
      { path: 'view-coupon-code/:id', loadChildren:()=>import('./view-coupon-code/view-coupon-code.module').then(VC=>VC.ViewCouponCodeModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponCodeRoutingModule { }
