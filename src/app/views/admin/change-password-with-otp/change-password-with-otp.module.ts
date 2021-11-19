import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordWithOtpComponent } from './change-password-with-otp.component';
import { ChangePasswordWithOtpRoutingModule} from './change-password-with-otp-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChangePasswordWithOtpComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChangePasswordWithOtpRoutingModule,
  ]
})
export class ChangePasswordWithOtpModule { }
