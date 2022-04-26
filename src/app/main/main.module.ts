import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { AppRoutingModule } from '../app-routing.module';
import { ErrorModule } from '../error/error.module';
import { HintModule } from '../hint/hint.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, AppRoutingModule, ErrorModule, HintModule],
  providers: [],
})
export class MainModule {}
