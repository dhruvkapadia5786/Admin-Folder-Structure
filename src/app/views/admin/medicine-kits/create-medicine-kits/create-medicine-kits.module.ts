import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateMedicineKitsRoutingModule } from './create-medicine-kits-routing.module';
import { CreateMedicineKitsComponent } from './create-medicine-kits.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { Helper } from 'src/app/services/helper.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import {NcpdpDrugFormsModule} from '../../ncpdp-drug-forms/ncpdp-drug-forms.module';
import {NcpdpDrugFormsComponent} from '../../ncpdp-drug-forms/ncpdp-drug-forms.component';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextEditorModalModule } from '../../common-components/text-editor-modal/text-editor-modal.module';
import { TextEditorModalComponent } from '../../common-components/text-editor-modal/text-editor-modal.component';

@NgModule({
  declarations: [CreateMedicineKitsComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    CreateMedicineKitsRoutingModule,
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
    NcpdpDrugFormsModule,
    TextEditorModalModule
  ],
  providers:[Helper],
  entryComponents:[NcpdpDrugFormsComponent,TextEditorModalComponent]
})
export class CreateMedicineKitsModule { }
