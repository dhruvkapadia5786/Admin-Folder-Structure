import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadChildren:()=>import('../../views/admin/dashboard/dashboard.module').then(dashboard=>dashboard.DashboardModule) },
  { path: 'clinic',loadChildren:()=>import('../../views/admin/clinic/clinic.module').then(clinic=>clinic.ClinicModule) },
  { path: 'doctors', loadChildren:()=>import('../../views/admin/doctors/doctors.module').then(doctor=>doctor.DoctorsModule) },
  { path: 'account-request',loadChildren:()=>import('../../views/admin/doctor-account-request/doctor-account-request.module').then(DAR=>DAR.DoctorAccountRequestModule) },
  { path: 'doctor-registration-codes', loadChildren:()=>import('../../views/admin/doctor-registration-code/doctor-registration-code.module').then(DRC=>DRC.DoctorRegistrationCodeModule) },
  { path: 'patients', loadChildren:()=>import('../../views/admin/customers/customers.module').then(cust=>cust.CustomersModule) },
  { path: 'technicians', loadChildren:()=>import('../../views/admin/technicians/technicians.module').then(technicians=>technicians.TechniciansModule) },
  { path: 'medicine-kits', loadChildren:()=>import('../../views/admin/medicine-kits/medicine-kits.module').then(medicinekit=>medicinekit.MedicineKitsModule) },
  { path: 'pharmacies', loadChildren:()=>import('../../views/admin/pharmacies/pharmacies.module').then(pharmacies=>pharmacies.PharmaciesModule) },
  { path: 'orders', loadChildren:()=>import('../../views/admin/admin-orders/admin-orders.module').then(AO=>AO.AdminOrdersModule) },
  { path: 'brands', loadChildren:()=>import('../../views/admin/brands/brands.module').then(brand=>brand.BrandsModule) },
  { path: 'treatment-conditions', loadChildren:()=>import('../../views/admin/treatment-conditions/treatment-conditions.module').then(HC=>HC.TreatmentConditionsModule) },
  { path: 'questions', loadChildren:()=>import('../../views/admin/questions/questions.module').then(QE=>QE.QuestionsModule) },
  { path: 'reports', loadChildren:()=>import('../../views/admin/reports/reports.module').then(Reports=>Reports.ReportsModule) },
  { path: 'countries', loadChildren:()=>import('../../views/admin/countries/countries.module').then(Country=>Country.CountryModule) },
  { path: 'states', loadChildren:()=>import('../../views/admin/states/states.module').then(States=>States.StatesModule) },
  { path: 'comment-categories', loadChildren:()=>import('../../views/admin/comment-categories/comment-categories.module').then(commentCategory=>commentCategory.CommentCategoriesModule) },
  { path: 'faq', loadChildren:()=>import('../../views/admin/faq/faq.module').then(faq=>faq.FaqModule)},
  { path: 'settings', loadChildren:()=>import('../../views/admin/settings/settings.module').then(settings=>settings.SettingsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
