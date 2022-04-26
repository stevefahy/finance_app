import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { HeaderComponent } from '../header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, AngularMaterialModule],
  exports: [HeaderComponent, AngularMaterialModule],
  providers: [],
})
export class HeaderModule {}
