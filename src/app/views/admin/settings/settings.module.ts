import { NgModule } from '@angular/core';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
  SharedModule,
    MatCheckboxModule, MatSelectModule, MatRadioModule,MatSlideToggleModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
