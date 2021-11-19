import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { CreateQuestionComponent } from './create-question.component';
import { CreateQuestionRoutingModule } from './create-question-routing.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        CreateQuestionComponent,
    ],
    imports: [
        CommonModule,
        CreateQuestionRoutingModule,
        SharedModule,
        DataTablesModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSelectModule
    ],
    providers: [],
    exports: [RouterModule]
})
export class CreateQuestionModule { }
