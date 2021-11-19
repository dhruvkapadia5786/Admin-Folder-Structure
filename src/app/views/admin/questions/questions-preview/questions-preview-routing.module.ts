import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuestionPreviewComponent } from "./questions-preview.component";
import { AuthGuard } from "src/app/guards/auth.guard";
const routes: Routes = [
  {
    path: "",
    component: QuestionPreviewComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionPreviewRoutingModule {}
