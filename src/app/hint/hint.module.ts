import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintComponent } from './hint.component';

@NgModule({
  declarations: [HintComponent],
  imports: [CommonModule],
  providers: [],
  exports: [HintComponent],
})
export class HintModule {}
