import { NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask'
import { Toastr } from '../services/toastr.service';
import { Helper } from '../services/helper.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(),
    BlockUIModule.forRoot({
      message:'Loading...'
    }),
    FormsModule, 
    ReactiveFormsModule,
  ],
  providers: [
    Toastr,
    Helper
  ],
  exports: [
    CommonModule,
    NgxMaskModule,
    FormsModule,
    ReactiveFormsModule,
    BlockUIModule
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
