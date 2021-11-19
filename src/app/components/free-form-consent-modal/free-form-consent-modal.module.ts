import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreeFormConsentModalComponent } from './free-form-consent-modal.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FreeFormConsentModalComponent],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule
  ],
  exports:[FreeFormConsentModalComponent]
})
export class FreeFormConsentModalModule { }
