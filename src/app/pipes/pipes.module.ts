import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhonePipe } from './phone.pipe';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [
    PhonePipe,
    SearchPipe
  ],
  imports: [
  ],
  providers: [],
  exports: [PhonePipe,SearchPipe]
})
export class PipesModule { }
