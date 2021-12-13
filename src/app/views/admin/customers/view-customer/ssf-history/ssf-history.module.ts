import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SsfHistoryComponent } from "./ssf-history.component";
import { SsfHistoryRoutingModule } from './ssf-history-routing.module';
import {QuizAnswersModule} from 'src/app/shared/quiz-answers/quiz-answers.module';

@NgModule({
  declarations: [SsfHistoryComponent],
  imports: [
    CommonModule,
    SsfHistoryRoutingModule,
    QuizAnswersModule
  ]
})
export class SsfHistoryModule { }
