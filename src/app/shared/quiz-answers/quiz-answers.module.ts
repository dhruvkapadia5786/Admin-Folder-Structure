import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizAnswersComponent } from './quiz-answers.component';

@NgModule({
  declarations: [QuizAnswersComponent],
  imports: [
    CommonModule
  ],
  exports:[QuizAnswersComponent]
})
export class QuizAnswersModule { }
