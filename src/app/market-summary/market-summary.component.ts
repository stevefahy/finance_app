import { Component, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketDataService } from '../services/market-data/market.data.service';
import { MarketSummaryCurrency } from '../services/currency-market/currency.market.model';
import { MarketCurrencyRates } from '../services/currency-market/currency.market.model';
import { Change } from '../models/change.model';
import { CURRENCIES, CurrencyDefault } from '../settings/currencies';

@Component({
  selector: 'app-market-summary',
  templateUrl: './market-summary.component.html',
  styleUrls: ['./market-summary.component.scss'],
})
export class MarketSummaryComponent implements OnInit {
  private currencyValues: MarketCurrencyRates;
  private currencies: CurrencyDefault[] = CURRENCIES;
  public marketCurrencies: MarketSummaryCurrency[];
  private allDataUpdatedListenerSubs: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.allDataUpdatedListenerSubs = this.marketDataService
      .getAllDataUpdatedistener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.currencyValues = { ...res.currency_values };
        this.createMarketSummary(this.currencyValues);
      });
  }

  ngOnDestroy(): void {
    this.allDataUpdatedListenerSubs.unsubscribe();
    this.ngUnsubscribe.next(void 0);
    this.ngUnsubscribe.complete();

    this.currencies = [];
    this.marketCurrencies = [];
  }

  getchangeStyle(val: number, compare: number): Change {
    let change: Change = 'nochange';
    if (val > compare) {
      change = 'increase';
    } else if (val < compare) {
      change = 'decrease';
    }
    return change;
  }

  private createMarketSummary(curr: MarketCurrencyRates): void {
    this.marketCurrencies = [];
    for (let [key, value] of Object.entries(curr)) {
      if (key != 'EUR') {
        this.marketCurrencies.push({
          currency: key,
          symbol: this.getCurrencySymbol(key),
          rate: value['current'],
          euro: 1 / +value['current'],
          last: value['last'],
        });
      }
    }
  }

  private getCurrencySymbol(currency: string): string {
    let cur = this.currencies.find((x) => x.id === currency);
    let currency_symbol = cur.symbol;
    return currency_symbol;
  }
}
