
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionPreviewComponent } from './questions-preview.component';
import { QuestionPreviewRoutingModule } from './questions-preview-routing.module';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUiLoaderComponent } from 'src/app/shared/block-ui-loader/block-ui-loader.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    QuestionPreviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    QuestionPreviewRoutingModule,
    BlockUIModule.forRoot({
      template: BlockUiLoaderComponent
    }),
    ProgressbarModule.forRoot(),
    MatAutocompleteModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule
  ],
  providers: [],
  exports: [RouterModule]
})
export class QuestionPreviewModule { }
