import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AppComponent } from './app.component';
import { StocksModule } from './stocks/stocks.module';
import { TaxModule } from './tax/tax.module';
import { AccountsModule } from './accounts/accounts.nodule';
import { HeaderModule } from './header/header.module';
import { MarketSummaryModule } from './market-summary/market-summary.module';
import { UserSummaryModule } from './user-summary/user-summary.module';
import { AngularMaterialModule } from './angular-material.module';
import { MainModule } from './main/main.module';
import {
  ErrorInterceptor,
  GlobalErrorHandlerService,
} from './error-interceptor';
import { ErrorModule } from './error/error.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HintModule } from './hint/hint.module';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ErrorDialogModule } from './error-dialog/error-dialog.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HintModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StocksModule,
    TaxModule,
    AccountsModule,
    HeaderModule,
    MarketSummaryModule,
    UserSummaryModule,
    AngularMaterialModule,
    MainModule,
    ErrorModule,
    NgbModule,
  ],
  exports: [ErrorModule, HintModule, ErrorDialogModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
  ],
  entryComponents: [ErrorDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
