import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { UserStock } from '../stocks.user.model';
import { MarketStock } from '../stocks.market.model';
import { Change } from '../../models/change.model';
import { CURRENCIES, CurrencyDefault } from '../../settings/currencies';

@Component({
  selector: 'stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss'],
})
export class StockDetailComponent implements OnInit, OnDestroy {
  @Input() item: UserStock;
  @Input() market: MarketStock;

  public panelOpenState = false;

  public userStocks: UserStock[] = [];
  private currencies: CurrencyDefault[] = CURRENCIES;
  private allDataUpdatedListenerSubs: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(
    private marketDataService: MarketDataService,
    public router: Router
  ) {}

  ngOnInit(): void {}

  public toggleExpand() {
    this.panelOpenState = !this.panelOpenState;
  }

  public editStock(id): void {
    this.router.navigate(['/edit', id]);
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

  public getCurrencySymbol(currency: string): string {
    let cur = this.currencies.find((x) => x.id === currency);
    let currency_symbol = cur.symbol;
    return currency_symbol;
  }

  ngOnDestroy(): void {
    this.userStocks = [];
    this.currencies = [];
  }
}
