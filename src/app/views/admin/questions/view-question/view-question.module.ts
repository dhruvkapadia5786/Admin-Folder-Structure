import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { ViewQuestionComponent } from './view-question.component';
import { ViewQuestionRoutingModule } from './view-question-routing.module';


@NgModule({
    declarations: [
        ViewQuestionComponent,
    ],
    imports: [
        ViewQuestionRoutingModule,
        SharedModule,
        DataTablesModule
    ],
    providers: [],
    exports: [RouterModule]
})
export class ViewQuestionModule { }
