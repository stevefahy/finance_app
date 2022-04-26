import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { AccountCreateEditComponent } from '../accounts/account-create-edit/account-create-edit.component';
import { AccountListComponent } from '../accounts/account-list/account-list.component';
import { HintModule } from '../hint/hint.module';

@NgModule({
  declarations: [AccountCreateEditComponent, AccountListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatSelectModule,
    HintModule,
  ],
  providers: [],
})
export class AccountsModule {}
