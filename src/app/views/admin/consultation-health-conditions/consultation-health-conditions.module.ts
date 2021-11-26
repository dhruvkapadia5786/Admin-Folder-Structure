import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { Helper } from 'src/app/services/helper.service';
import { ConsultationHealthConditionsRoutingModule } from './consultation-health-conditions-routing.module';

import { ConsultationHealthConditionsComponent } from './consultation-health-conditions.component';
import { ConsultationHealthConditionsService } from './consultation-health-conditions.service';

import { CreateHealthConditionsComponent } from './create-health-conditions/create-health-conditions.component';
import { EditHealthConditionsComponent } from './edit-health-conditions/edit-health-conditions.component';
import { ListHealthConditionsComponent } from './list-health-conditions/list-health-conditions.component';
import { ChangeSequenceComponent } from './change-sequence/change-sequence.component';

import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [ConsultationHealthConditionsComponent, CreateHealthConditionsComponent, EditHealthConditionsComponent, ChangeSequenceComponent, ListHealthConditionsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ConsultationHealthConditionsRoutingModule,
    PipesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTabsModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    NgxMaskModule,
    DragDropModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ConsultationHealthConditionsService, CurrencyPipe]
})
export class ConsultationHealthConditionsModule { }
