import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadChildren:()=>import('../../views/admin/dashboard/dashboard.module').then(dashboard=>dashboard.DashboardModule) },
  { path: 'patients', loadChildren:()=>import('../../views/admin/customers/customers.module').then(cust=>cust.CustomersModule) },
  { path: 'manufacturers', loadChildren:()=>import('../../views/admin/manufacturers/manufacturers.module').then(manufacturers=>manufacturers.ManufacturersModule) },
  { path: 'brands', loadChildren:()=>import('../../views/admin/brands/brands.module').then(brand=>brand.BrandsModule) },
  { path: 'categories',loadChildren:()=>import('../../views/admin/categories/categories.module').then(categories=>categories.CategoriesModule)},
  { path:'otc-drugs',loadChildren:()=>import('../../views/admin/otc-drugs-list/otc-drugs-list.module').then(otcProducts=>otcProducts.OtcDrugsListModule)},
  { path: 'products',loadChildren:()=>import('../../views/admin/products/products.module').then(product=>product.ProductsModule)},
  { path: 'reports', loadChildren:()=>import('../../views/admin/reports/reports.module').then(Reports=>Reports.ReportsModule) },
  { path: 'faq', loadChildren:()=>import('../../views/admin/faq/faq.module').then(faq=>faq.FaqModule)},
  { path: 'faq-group', loadChildren:()=>import('../../views/admin/faq-group/faq-group.module').then(faq=>faq.FAQGroupModule)},
  { path:'policy',  loadChildren:()=>import('../../views/admin/policy/policy.module').then(policy=>policy.PolicyModule)},
  { path: 'settings', loadChildren:()=>import('../../views/admin/settings/settings.module').then(settings=>settings.SettingsModule) },
  { path: 'drug-order',loadChildren:()=>import('../../views/admin/admin-drug-orders/admin-drug-orders.module').then(drugOrder=>drugOrder.AdminDrugOrdersModule)},
  { path: 'bannersets', loadChildren:()=>import('../../views/admin/banner-sets/banner-sets.module').then(bs=>bs.BannerSetsModule) },
  { path: 'article-categories',loadChildren:()=>import('../../views/admin/article-categories/article-categories.module').then(categories=>categories.ArticleCategoriesModule)},
  { path: 'articles',loadChildren:()=>import('../../views/admin/articles/article.module').then(article=>article.ArticleModule)},
  { path: 'attributes',loadChildren:()=>import('../../views/admin/attributes/attributes.module').then(attribute=>attribute.AttributesModule)}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
