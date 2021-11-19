import { NgModule } from "@angular/core";
import { RouterModule, Routes, ActivatedRouteSnapshot } from "@angular/router";
import { DemoSampleComponent } from "./demo-sample.component";

const routes: Routes = [
    {
        path: "", component: DemoSampleComponent
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})
export class DemoSampleRoutingModule { }
