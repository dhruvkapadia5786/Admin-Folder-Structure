import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditMedicineKitsRoutingModule } from './edit-medicine-kits-routing.module';
import { EditMedicineKitsComponent } from './edit-medicine-kits.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { Helper } from 'src/app/services/helper.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {NcpdpDrugFormsModule} from '../../ncpdp-drug-forms/ncpdp-drug-forms.module';
import {NcpdpDrugFormsComponent} from '../../ncpdp-drug-forms/ncpdp-drug-forms.component';


@NgModule({
  declarations: [EditMedicineKitsComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    EditMedicineKitsRoutingModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    FormsModule,
    NcpdpDrugFormsModule
  ],
  providers:[Helper],
  entryComponents:[NcpdpDrugFormsComponent]
})
export class EditMedicineKitsModule { }
