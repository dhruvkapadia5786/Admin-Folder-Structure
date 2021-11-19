import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionEditComponent } from './question-edit.component';
import { QuestionEditRoutingModule } from './question-edit-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [QuestionEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    QuestionEditRoutingModule
  ]
})
export class QuestionEditModule { }
