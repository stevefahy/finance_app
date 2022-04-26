import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { UserAccount } from '../account.model';
import { CURRENCIES, CurrencyDefault } from '../../settings/currencies';
import { HintService } from 'src/app/hint/hint.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit {
  public mode: string = '';
  public accountData: UserAccount[] = [];
  private allDataUpdatedListenerSubs: Subscription;
  private ngUnsubscribe = new Subject();
  private currencies: CurrencyDefault[] = CURRENCIES;

  constructor(
    public router: Router,
    private marketDataService: MarketDataService,
    private hintService: HintService
  ) {}

  ngOnInit(): void {
    this.allDataUpdatedListenerSubs = this.marketDataService
      .getAllDataUpdatedistener()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        let initial_accounts = res.user_accounts;
        this.accountData = [...initial_accounts];
        if (this.accountData.length < 1) {
          this.hintService.throwHint({
            name: 'accounts',
          });
        }
      });
  }

  public create(): void {
    this.router.navigate(['/edit-account']);
  }

  public editAccount(id): void {
    this.router.navigate(['/edit-account', id]);
  }

  public getCurrencySymbol(currency: string): string {
    let cur = this.currencies.find((x) => x.id === currency);
    let currency_symbol = cur.symbol;
    return currency_symbol;
  }

  ngOnDestroy(): void {
    this.allDataUpdatedListenerSubs.unsubscribe();
    this.ngUnsubscribe.next(void 0);
    this.ngUnsubscribe.complete();
    this.accountData = [];
    this.currencies = [];
  }
}
