import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { UserStock } from '../stocks.user.model';
import { MarketStock } from '../stocks.market.model';
import { StockStatus } from '../stock_status.model';
import { HintService } from 'src/app/hint/hint.service';

@Component({
  selector: 'stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
})
export class StockListComponent implements OnInit, OnDestroy {
  public userStocks: UserStock[] = [];
  public marketStocks: MarketStock[] = [];
  private allDataUpdatedListenerSubs: Subscription;
  private ngUnsubscribe = new Subject();

  constructor(
    private marketDataService: MarketDataService,
    private router: Router,
    private hintService: HintService
  ) {}

  ngOnInit(): void {
    this.allDataUpdatedListenerSubs = this.marketDataService
      .getAllDataUpdatedistener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.userStocks = [...res.user_stocks];
        this.marketStocks = [...res.market_stocks];
        if (this.userStocks.length < 1) {
          this.hintService.throwHint({
            name: 'stocks',
          });
        }
      });
  }

  public trackByFunction(index, item) {
    return item ? item.id : undefined;
  }

  public getMarketStock(ticker: string): MarketStock {
    return this.marketStocks.filter((x) => x.symbol == ticker.toUpperCase())[0];
  }

  public userStocksByStatus(status: StockStatus): UserStock[] {
    return this.userStocks.filter((x) => x.status == status);
  }

  public create(): void {
    this.router.navigate(['/create']);
  }

  ngOnDestroy(): void {
    this.allDataUpdatedListenerSubs.unsubscribe();
    this.ngUnsubscribe.next(void 0);
    this.ngUnsubscribe.complete();

    this.userStocks = [];
    this.marketStocks = [];
  }
}
