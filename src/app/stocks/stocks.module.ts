import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorModule } from '../error/error.module';
import { HintModule } from '../hint/hint.module';
import { StockCreateComponent } from './stock-create-edit/stock-create-edit.component';
import { StockListComponent } from './/stock-list/stock-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { MarketStockDetailComponent } from './market-stock-detail/market-stock-detail.component';

@NgModule({
  declarations: [
    StockCreateComponent,
    StockListComponent,
    StockDetailComponent,
    MarketStockDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    NgbModule,
    ErrorModule,
    HintModule,
  ],
  providers: [],
})
export class StocksModule {}
