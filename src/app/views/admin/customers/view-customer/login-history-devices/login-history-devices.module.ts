import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginHistoryDevicesRoutingModule } from './login-history-devices-routing.module';
import { LoginHistoryDevicesComponent } from './login-history-devices.component';

@NgModule({
  declarations: [LoginHistoryDevicesComponent],
  imports: [
    CommonModule,
    LoginHistoryDevicesRoutingModule
  ]
})
export class LoginHistoryDevicesModule { }
