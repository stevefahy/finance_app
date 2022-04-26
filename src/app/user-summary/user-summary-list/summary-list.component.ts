import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserAccount } from 'src/app/accounts/account.model';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { Change } from '../../models/change.model';

@Component({
  selector: 'app-summary-list',
  templateUrl: './summary-list.component.html',
  styleUrls: ['./summary-list.component.scss'],
})
export class SummaryListComponent implements OnInit, OnDestroy {
  public panelOpenState = false;
  // All Totals
  public all_all_value_euro_current: number;
  public all_all_value_euro_original: number;
  public all_all_value_euro_change: number;
  public all_all_value_euro_change_percent: number;

  public all_all_tax_due: number;
  public all_all_value_euro_current_post_tax: number;
  public all_all_value_euro_change_post_tax: number;
  public all_all_value_euro_change_post_tax_percent: number;
  // Stocks - All Totals
  public stocks_all_value_euro_current: number;
  public stocks_all_value_euro_original: number;
  public stocks_all_value_euro_change: number;
  public stocks_all_value_euro_change_percent: number;
  public stocks_all_tax_due: number;
  public stocks_all_value_euro_current_post_tax: number;
  public stocks_all_value_euro_change_post_tax: number;
  public stocks_all_value_euro_change_post_tax_percent: number;
  // Stocks - Open Totals
  public stocks_open_value_euro_current: number;
  public stocks_open_value_euro_original: number;
  public stocks_open_value_euro_change: number;
  public stocks_open_value_euro_change_percent: number;
  public stocks_open_tax_due: number;
  public stocks_open_value_euro_current_post_tax: number;
  public stocks_open_value_euro_change_post_tax: number;
  public stocks_open_value_euro_change_post_tax_percent: number;
  // Stocks - Closed Totals
  public stocks_closed_value_euro_current: number;
  public stocks_closed_value_euro_original: number;
  public stocks_closed_value_euro_change: number;
  public stocks_closed_value_euro_change_percent: number;
  public stocks_closed_tax_due: number;
  public stocks_closed_value_euro_current_post_tax: number;
  public stocks_closed_value_euro_change_post_tax: number;
  public stocks_closed_value_euro_change_post_tax_percent: number;
  // Accounts
  public accounts_total_euro: number;
  public userAccounts: UserAccount[] = [];

  public user_stock_number: number;
  public user_account_number: number;
  public user_taxes_number: number;

  private allDataUpdatedListenerSubs: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.allDataUpdatedListenerSubs = this.marketDataService
      .getAllDataUpdatedistener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.user_stock_number = res.user_stocks.length;
        this.user_account_number = res.user_accounts.length;
        this.user_taxes_number = res.user_taxes.length;
        let totals = { ...res.totals };
        // All Totals
        this.all_all_value_euro_original = totals.all.all.value_euro_original;
        this.all_all_value_euro_current = totals.all.all.value_euro_current;
        this.all_all_value_euro_change = totals.all.all.value_euro_change;
        this.all_all_value_euro_change_percent =
          totals.all.all.value_euro_change_percent;
        this.all_all_tax_due = totals.all.all.tax_due;
        this.all_all_value_euro_current_post_tax =
          totals.all.all.value_euro_current_post_tax;
        this.all_all_value_euro_change_post_tax =
          totals.all.all.value_euro_change_post_tax;
        this.all_all_value_euro_change_post_tax_percent =
          totals.all.all.value_euro_change_post_tax_percent;
        // Stocks - All
        this.stocks_all_value_euro_original =
          totals.stocks.all.value_euro_original;
        this.stocks_all_value_euro_current =
          totals.stocks.all.value_euro_current;
        this.stocks_all_value_euro_change = totals.stocks.all.value_euro_change;
        this.stocks_all_value_euro_change_percent =
          totals.stocks.all.value_euro_change_percent;
        this.stocks_all_tax_due = totals.stocks.all.tax_due;
        this.stocks_all_value_euro_current_post_tax =
          totals.stocks.all.value_euro_current_post_tax;
        this.stocks_all_value_euro_change_post_tax =
          totals.stocks.all.value_euro_change_post_tax;
        this.stocks_all_value_euro_change_post_tax_percent =
          totals.stocks.all.value_euro_change_post_tax_percent;
        // Stocks - Open
        this.stocks_open_value_euro_original =
          totals.stocks.open.value_euro_original;
        this.stocks_open_value_euro_current =
          totals.stocks.open.value_euro_current;
        this.stocks_open_value_euro_change =
          totals.stocks.open.value_euro_change;
        this.stocks_open_value_euro_change_percent =
          totals.stocks.open.value_euro_change_percent;
        this.stocks_open_tax_due = totals.stocks.open.tax_due;
        this.stocks_open_value_euro_current_post_tax =
          totals.stocks.open.value_euro_current_post_tax;
        this.stocks_open_value_euro_change_post_tax =
          totals.stocks.open.value_euro_change_post_tax;
        this.stocks_open_value_euro_change_post_tax_percent =
          totals.stocks.open.value_euro_change_post_tax_percent;
        // Stocks - Closed
        this.stocks_closed_value_euro_original =
          totals.stocks.closed.value_euro_original;
        this.stocks_closed_value_euro_current =
          totals.stocks.closed.value_euro_current;
        this.stocks_closed_value_euro_change =
          totals.stocks.closed.value_euro_change;
        this.stocks_closed_value_euro_change_percent =
          totals.stocks.closed.value_euro_change_percent;
        this.stocks_closed_tax_due = totals.stocks.closed.tax_due;
        this.stocks_closed_value_euro_current_post_tax =
          totals.stocks.closed.value_euro_current_post_tax;
        this.stocks_closed_value_euro_change_post_tax =
          totals.stocks.closed.value_euro_change_post_tax;
        this.stocks_closed_value_euro_change_post_tax_percent =
          totals.stocks.closed.value_euro_change_post_tax_percent;
        // Accounts
        this.userAccounts = [...res.user_accounts];
        this.accounts_total_euro = totals.accounts.value_euro_current;
      });
  }

  ngOnDestroy(): void {
    this.allDataUpdatedListenerSubs.unsubscribe();
    this.ngUnsubscribe.next(void 0);
    this.ngUnsubscribe.complete();

    this.accounts_total_euro = 0;
    this.userAccounts = [];
  }

  public toggleExpand() {
    this.panelOpenState = !this.panelOpenState;
  }

  public getchangeStyle(val, compare): Change {
    let change: Change = 'nochange';
    if (val > compare) {
      change = 'increase';
    } else if (val < compare) {
      change = 'decrease';
    }
    return change;
  }
}
