import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwilioSmsComponent } from './twilio-sms.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TwilioSmsComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[TwilioSmsComponent]
})
export class TwilioSmsModule { }
