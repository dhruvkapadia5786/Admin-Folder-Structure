import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NcpdpDrugFormsComponent } from './ncpdp-drug-forms.component';
import {NcpdpDrugFormsService} from './ncpdp-drug-forms.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';

@NgModule({
  declarations: [NcpdpDrugFormsComponent],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    TypeaheadModule.forRoot()
  ],
  exports:[NcpdpDrugFormsComponent],
  providers:[NcpdpDrugFormsService]
})
export class NcpdpDrugFormsModule { }
