import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { DoctorAccountRequestComponent } from './doctor-account-request.component';
import { DoctorAccountRequestRoutingModule } from './doctor-account-request-routing.module';
import { AccountRequestListComponent} from './account-request-list/account-request-list.component';
import { AccountRequestViewComponent } from './account-request-view/account-request-view.component';
import { AccountRequestEditComponent } from './account-request-edit/account-request-edit.component';
import { AccountRequestRegistrationComponent } from './account-request-registration/account-request-registration.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ImagePreviewModule } from 'src/app/shared/image-preview/image-preview.module';
import { ClinicService } from '../clinic/clinic.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [DoctorAccountRequestComponent,AccountRequestListComponent,AccountRequestViewComponent, AccountRequestEditComponent, AccountRequestRegistrationComponent],
  imports: [
    CommonModule,
    SharedModule,
    DoctorAccountRequestRoutingModule,
    NgxMaskModule,
    DataTablesModule,
    MatTabsModule,MatRadioModule,
    MatDatepickerModule, MatNativeDateModule, 
    MatCheckboxModule, MatSelectModule ,
    FormsModule,ReactiveFormsModule,
    ImagePreviewModule
  ],
  providers:[ClinicService]
})
export class DoctorAccountRequestModule { }
