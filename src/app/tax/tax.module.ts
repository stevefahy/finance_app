import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { TaxCreateEditComponent } from './../tax/tax-create-edit/tax-create-edit.component';
import { TaxListComponent } from './tax-list/tax-list.component';
import { HintModule } from '../hint/hint.module';

@NgModule({
  declarations: [TaxCreateEditComponent, TaxListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    HintModule,
  ],
  providers: [],
})
export class TaxModule {}
