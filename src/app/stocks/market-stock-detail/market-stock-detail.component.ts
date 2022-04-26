import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { MarketStock } from '../stocks.market.model';
import { Change } from '../../models/change.model';
import { CURRENCIES, CurrencyDefault } from '../../settings/currencies';

@Component({
  selector: 'market-stock-detail',
  templateUrl: './market-stock-detail.component.html',
  styleUrls: ['./market-stock-detail.component.scss'],
})
export class MarketStockDetailComponent implements OnInit {
  @Input() item: MarketStock;

  private allDataUpdatedListenerSubs: Subscription;
  private ngUnsubscribe = new Subject();
  private currencies: CurrencyDefault[] = CURRENCIES;

  public marketStocks: MarketStock[] = [];

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.allDataUpdatedListenerSubs = this.marketDataService
      .getAllDataUpdatedistener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.marketStocks = [...res.market_stocks];
      });
  }

  getCurrencySymbol(currency: string): string {
    let cur = this.currencies.find((x) => x.id === currency.toUpperCase());
    let currency_symbol = cur.symbol;
    return currency_symbol;
  }

  getchangeStyle(val, compare): Change {
    let change: Change = 'nochange';
    if (val > compare) {
      change = 'increase';
    } else if (val < compare) {
      change = 'decrease';
    }
    return change;
  }

  ngOnDestroy(): void {
    this.allDataUpdatedListenerSubs.unsubscribe();
    this.ngUnsubscribe.next(void 0);
    this.ngUnsubscribe.complete();

    this.currencies = [];
    this.marketStocks = [];
  }
}
