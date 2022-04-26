import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryListComponent } from './user-summary-list/summary-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SummaryListComponent],
  imports: [CommonModule, AngularMaterialModule, NgbModule],
  providers: [],
})
export class UserSummaryModule {}
