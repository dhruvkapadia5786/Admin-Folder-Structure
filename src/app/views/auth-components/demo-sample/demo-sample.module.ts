
import { NgModule } from "@angular/core";

import { DemoSampleRoutingModule } from "./demo-sample-routing.module";
import { DemoSampleComponent } from "./demo-sample.component";
import { HttpInterceptorModule } from 'src/app/interceptors/http.interceptor.module';
import { CommonModule } from "@angular/common";
import { LoginService } from "../login/login.service";
import { FormsModule , ReactiveFormsModule}   from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpInterceptorModule,
    DemoSampleRoutingModule
  ],
  providers:[LoginService],
  declarations:[
    DemoSampleComponent
  ]
})

export class DemoSampleModule {}
