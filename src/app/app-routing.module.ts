import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockCreateComponent } from './stocks/stock-create-edit/stock-create-edit.component';
import { AuthGuard } from './auth/auth.guard';
import { StockListComponent } from './stocks/stock-list/stock-list.component';
import { TaxListComponent } from './tax/tax-list/tax-list.component';
import { HeaderComponent } from './header/header.component';
import { TaxCreateEditComponent } from './tax/tax-create-edit/tax-create-edit.component';
import { AccountCreateEditComponent } from './accounts/account-create-edit/account-create-edit.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { SummaryListComponent } from './user-summary/user-summary-list/summary-list.component';
import { MarketSummaryComponent } from './market-summary/market-summary.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainComponent,
    data: { animation: 'Home' },
    canActivate: [AuthGuard],

    children: [
      {
        path: '',
        outlet: 'header',
        component: HeaderComponent,
      },
      {
        path: '',
        outlet: 'summarylist',
        component: SummaryListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        outlet: 'marketSummary',
        component: MarketSummaryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        outlet: 'stocklist',
        component: StockListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        outlet: 'taxList',
        component: TaxListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        outlet: 'accountList',
        component: AccountListComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'create',
    component: StockCreateComponent,
    canActivate: [AuthGuard],
    data: { animation: 'FilterPage' },
  },
  {
    path: 'edit/:stockId',
    component: StockCreateComponent,
    canActivate: [AuthGuard],
    data: { animation: 'FilterPage' },
  },
  {
    path: 'edit-tax',
    component: TaxCreateEditComponent,
    canActivate: [AuthGuard],
    data: { animation: 'FilterPage' },
  },
  {
    path: 'edit-tax/:taxId',
    component: TaxCreateEditComponent,
    canActivate: [AuthGuard],
    data: { animation: 'FilterPage' },
  },
  {
    path: 'edit-account',
    component: AccountCreateEditComponent,
    canActivate: [AuthGuard],
    data: { animation: 'FilterPage' },
  },
  {
    path: 'edit-account/:accountId',
    component: AccountCreateEditComponent,
    canActivate: [AuthGuard],
    data: { animation: 'FilterPage' },
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'disabled' }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
