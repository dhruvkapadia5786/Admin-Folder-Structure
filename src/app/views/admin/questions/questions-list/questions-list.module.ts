import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { QuestionsListComponent } from './questions-list.component';
import { QuestionsListRoutingModule } from './questions-list-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { Helper } from 'src/app/services/helper.service';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        QuestionsListComponent,
    ],
    imports: [
        QuestionsListRoutingModule,
        SharedModule,
        FormsModule,
        DataTablesModule,
        MatCheckboxModule,
        MatSelectModule,
        AccordionModule.forRoot()
    ],
    providers: [Helper],
    exports: [RouterModule]
})
export class QuestionsListModule { }
