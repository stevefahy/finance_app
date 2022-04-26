import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, skip, distinctUntilChanged, tap } from 'rxjs/operators';
import {
  of,
  ReplaySubject,
  Subscription,
  timer,
  Observable,
  throwError,
} from 'rxjs';
import { UserTaxObservable, UserTax } from '../../tax/tax.model';
import {
  UserAccount,
  UserAccountObservable,
} from '../../accounts/account.model';
import {
  MarketStock,
  MarketStockServerObservable,
} from 'src/app/stocks/stocks.market.model';
import { UserStock, UserStockObservable } from '../../stocks/stocks.user.model';
import { MarketCurrencyRates } from '../../services/currency-market/currency.market.model';
import { AllDataInterface, TotalsInterface } from './all_data.model';
import { AllData, Totals } from './all_data.class';
import { TaxUserService } from '../../tax/tax.user.service';
import { AccountUserService } from '../../accounts/account.user.service';
import { StocksUserService } from '../../stocks/stocks.user.service';
import { StocksMarketService } from '../../stocks/stocks.market.service';
import { CurrencyMarketService } from '../currency-market/currency.market.service';
import { LogService } from '../../settings/logging.service';
import { AuthService } from '../../auth/auth.service';
import { AndroidService } from '../../android/android.service';
import { CURRENCIES, CurrencyDefault } from '../../settings/currencies';
import { POLLING_SETTINGS } from '../../settings/polling';
import { DEBUG } from '../../settings/debug';
import { LoadingService } from '../loading/loading.service';
import { ErrorService } from 'src/app/error/error.service';

@Injectable({ providedIn: 'root' })
export class MarketDataService {
  // GET ALL DATA
  // get User Stock (user id)
  //    retrieve symbols & currencies
  //    get Market Stock (symbols)
  //    get currency (currencies & default currencies)
  // get calculation (User Stock, Market Stock, Currencies)

  // USER UPDATES STOCKS
  //    GET ALL DATA

  // POLL LATEST DATA
  // From User Stock (already loaded)
  //    get Market Stock (symbols)
  //    get currency (currencies & default currencies)
  // get calculation (User Stock, Market Stock, Currencies)

  private allDataUpdated = new ReplaySubject<AllDataInterface>(1);
  private allTaxUpdatedListenerSubs: Subscription;
  private allAccountUpdatedListenerSubs: Subscription;
  private allStockUpdatedListenerSubs: Subscription;
  private authListenerSubs: Subscription;
  private timerSub: Subscription;

  private subscribe_account: Subscription;
  private loadingTimer: ReturnType<typeof setTimeout>;

  public userIsAuthenticated: boolean = false;

  public default_currencies: CurrencyDefault[] = CURRENCIES;
  public stocks_open_tickers: string;
  public unique_currencies: string[];
  public user_stocks: UserStock[];
  public user_taxes: UserTax[];
  public user_accounts: UserAccount[];

  private tax_chargeable_gain_positive_total_closed: number = 0;
  private tax_chargeable_gain_negative_total_closed: number = 0;
  private tax_chargeable_gain_total_closed: number = 0;
  private tax_chargeable_gain_positive_total_open: number = 0;
  private tax_chargeable_gain_negative_total_open: number = 0;
  private tax_chargeable_gain_total_open: number = 0;

  private personal_exemption_current: number = 0;
  private allowable_loss: number = 0;
  private personal_tax_rate: number = 0;

  private tax_taxable_gain_closed: number = 0;
  private tax_taxable_gain_open: number = 0;

  private accounts_total_euro: number = 0;

  private user_accounts_loaded: boolean = false;
  private user_taxes_loaded: boolean = false;
  private user_stocks_loaded: boolean = false;

  private polling_settings = POLLING_SETTINGS;
  private debug = DEBUG;

  // All Total (Stocks Open, Stocks Closed, Accounts)
  // All Stocks Total (Open + Closed)
  // Open Stocks Total
  // Closed Stocks Total
  // Accounts Total

  // private all_data_object: AllDataInterface = new AllData();
  private all_data_object: AllDataInterface;

  constructor(
    private AccountUserService: AccountUserService,
    private TaxUserService: TaxUserService,
    private stocksUserService: StocksUserService,
    private stocksMarketService: StocksMarketService,
    private currencyMarketService: CurrencyMarketService,
    private authService: AuthService,
    private logger: LogService,
    private androidService: AndroidService,
    private loadingService: LoadingService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.all_data_object = new AllData();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authChange(this.userIsAuthenticated);
    // Listen for authentification change
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
        this.authChange(this.userIsAuthenticated);
      });

    this.androidService.onStart.subscribe((foo) => {
      // console.log('onStart', foo);
    });
    this.androidService.onResume.subscribe((foo) => {
      // console.log('onResume', foo);
      this.logger.log('Android onResume', foo);
      this.restartPolling();
    });
    this.androidService.onRestart.subscribe((foo) => {
      // console.log('onRestart', foo);
    });
    this.androidService.onStop.subscribe((foo) => {
      // console.log('onStop', foo);
    });
    this.androidService.onPause.subscribe((foo) => {
      // console.log('onPause', foo);
      this.logger.log('Android onPause', foo);
      this.stopPolling();
    });

    this.logger.title('DEBUG SETTINGS');
    this.logger.log(
      'User: ',
      this.debug.USER,
      'Market',
      this.debug.MARKET,
      'Polling',
      this.debug.POLLING,
      'Logging',
      this.debug.LOGGING
    );
  }

  private percentChange(current: number, original: number) {
    let percent_change = ((current - original) / original) * 100;
    if (isNaN(percent_change)) {
      percent_change = 0;
    }
    return percent_change;
  }

  private startSub(): void {
    this.allAccountUpdatedListenerSubs =
      this.AccountUserService.getAllAccountUpdatedistener()
        .pipe(skip(1), distinctUntilChanged())
        .subscribe((res: UserAccountObservable) => {
          this.user_accounts = res.accountData;
          this.getPollData();
        });

    this.allTaxUpdatedListenerSubs =
      this.TaxUserService.getAllTaxUpdatedistener()
        .pipe(skip(1), distinctUntilChanged())
        .subscribe((res: UserTaxObservable) => {
          this.user_taxes = res.taxData;
          this.getPollData();
        });

    this.allStockUpdatedListenerSubs = this.stocksUserService
      .getAllStockUpdatedistener()
      .pipe(skip(1), distinctUntilChanged())
      .subscribe((res: UserStockObservable) => {
        this.parseStocks(res.stockUserData);
        this.getPollData();
      });
  }

  private endsub(): void {
    clearTimeout(this.loadingTimer);
    if (this.allAccountUpdatedListenerSubs != undefined) {
      this.allAccountUpdatedListenerSubs.unsubscribe();
    }
    if (this.allTaxUpdatedListenerSubs != undefined) {
      this.allTaxUpdatedListenerSubs.unsubscribe();
    }
    if (this.allStockUpdatedListenerSubs != undefined) {
      this.allStockUpdatedListenerSubs.unsubscribe();
    }
    this.user_stocks = [];
    this.user_taxes = [];
    this.user_accounts = [];

    if (this.subscribe_account != undefined) {
      this.subscribe_account.unsubscribe();
    }

    this.user_accounts_loaded = false;
    this.user_stocks_loaded = false;
    this.user_taxes_loaded = false;

    // Clear the allDataUpdated
    let allDataUpdatedEmpty = new AllData();
    this.all_data_object = allDataUpdatedEmpty;
    this.allDataUpdated.next(allDataUpdatedEmpty);
  }

  private authChange(isAuthenticated: boolean): void {
    if (isAuthenticated) {
      this.getData();
      this.startPolling();
    } else {
      this.endsub();
      this.stopPolling();
    }
  }

  private checkAllLoaded() {
    this.logger.title('checkAllLoaded');
    // this.logger.log('user_accounts_loaded', this.user_accounts_loaded, 'user_stocks_loaded',   this.user_stocks_loaded, 'user_taxes_loaded',  this.user_taxes_loaded);
    if (
      this.user_accounts_loaded &&
      this.user_stocks_loaded &&
      this.user_taxes_loaded
    ) {
      this.logger.title('checkAllLoaded TRUE');
      // this.loadingService.setLoading('false');
      this.parseStocks(this.user_stocks);
      this.pollForData().subscribe((val: AllDataInterface) => {
        this.allDataUpdated.next(val);
        this.logger.title('checkAllLoaded TRUE pollForData Finished');
        clearTimeout(this.loadingTimer);
        this.loadingTimer = setTimeout(() => {
          this.loadingService.setLoading('false');
        }, 500);
      });
      // Subscribe for change in values
      this.startSub();
    }
  }

  // START
  private getData(): void {
    // Clear the allDataUpdated (So that zero values are displayed - in case of error)
    let allDataUpdatedEmpty = new AllData();
    this.all_data_object = allDataUpdatedEmpty;
    this.allDataUpdated.next(allDataUpdatedEmpty);

    this.loadingService.setLoading('true');
    const account_data: Observable<UserAccount[]> =
      this.AccountUserService.getUserAccountData().pipe(
        tap((res: UserAccount[]) => {
          return res;
        })
      );

    const subscribe_account = account_data.subscribe((val: UserAccount[]) => {
      this.user_accounts = val;
      this.user_accounts_loaded = true;
      this.logger.log('user_accounts_loaded', this.user_accounts_loaded);
      this.checkAllLoaded();
    });

    const tax_data: Observable<UserTax[]> =
      this.TaxUserService.getUserTaxData().pipe(
        tap((res) => {
          return res;
        })
      );

    const subscribe_tax = tax_data.subscribe((val) => {
      this.user_taxes = val;
      this.user_taxes_loaded = true;
      this.logger.log('user_taxes_loaded', this.user_taxes_loaded);
      this.checkAllLoaded();
    });

    const stocks_data: Observable<UserStock[]> = this.stocksUserService
      .getUserStocksData()
      .pipe(
        tap((res) => {
          return res;
        })
      );

    const subscribe_stock = stocks_data.subscribe((val) => {
      this.user_stocks = val;
      this.user_stocks_loaded = true;
      this.logger.log('user_stocks_loaded', this.user_stocks_loaded);
      this.checkAllLoaded();
    });
  }

  getAllDataUpdatedistener(): Observable<AllDataInterface> {
    return this.allDataUpdated.asObservable();
  }

  private parseStocks(stocks: UserStock[]): void {
    this.user_stocks = stocks;
    let all_stocks_open_tickers = stocks
      .filter((a) => a.status === 'open')
      .map((stock: UserStock) => stock.ticker);
    // eliminate any duplicate stocks
    this.stocks_open_tickers = [...new Set(all_stocks_open_tickers)].toString();
    let stock_currencies = stocks.map((stock: UserStock) => stock.currency);
    let default_currencies_array = this.default_currencies.map(
      (a: CurrencyDefault) => a.name
    );
    let all_currencies = [...default_currencies_array, ...stock_currencies];
    // store unique_currencies for polling (eliminate duplicates)
    this.unique_currencies = [...new Set(all_currencies)];
    this.user_stocks_loaded = true;
  }

  private getPollData(): void {
    if (this.userIsAuthenticated) {
      this.pollForData().subscribe((res: AllDataInterface) => {
        this.allDataUpdated.next(res);
      });
    } else {
      this.stopPolling();
    }
  }

  private pollForData(): Observable<AllDataInterface> {
    this.logger.title('pollForData');
    let user_stocks: UserStock[] = this.user_stocks;
    let user_taxes: UserTax[] = this.user_taxes;
    let user_accounts: UserAccount[] = this.user_accounts;
    let market_stocks: MarketStock[] = [];
    let currency_values: MarketCurrencyRates;

    // Clear any existing error (it may be resolved by the new poll for data)
    this.errorService.clearError();

    return this.stocksMarketService
      .getMarketStocksData(this.stocks_open_tickers)
      .pipe(
        concatMap((result: MarketStockServerObservable) => {
          if (result.error) {
            let first_stock = result.error.params[0];
            // If a ticker has thrown an error then go to the edit page for that ticker
            if (first_stock.length > 0) {
              let stock: UserStock = this.user_stocks.find(
                (x) => x.ticker === first_stock
              );
              let stock_id = stock._id;
              this.loadingService.setLoading('ignore');
              this.router.navigate(['/edit/' + stock_id]);
            }
            return throwError(result);
          }
          market_stocks = result.stocks;
          return this.currencyMarketService
            .getCurrencies(this.unique_currencies)
            .pipe(
              tap((val) => (currency_values = val)),
              concatMap((cur: MarketCurrencyRates) => {
                // Update the last currency rate value
                Object.keys(cur).map((key, index) => {
                  // If there was a previous currency rate then then set it as the last rate.
                  // Otherwise set the last currency rate the same as the current rate.
                  if (this.all_data_object.currency_values) {
                    if (this.all_data_object.currency_values[key]) {
                      cur[key]['last'] =
                        this.all_data_object.currency_values[key]['current'];
                    } else {
                      cur[key]['last'] = cur[key]['current'];
                    }
                  }
                });
                return this.calculateData(
                  user_stocks,
                  user_taxes,
                  user_accounts,
                  market_stocks,
                  currency_values
                ).pipe(
                  concatMap((all_data_calculated: AllDataInterface) => {
                    return of(all_data_calculated);
                  })
                );
              })
            );
        })
      );
  }

  private calculateData(
    user_stocks: UserStock[],
    user_taxes: UserTax[],
    user_accounts: UserAccount[],
    market_stocks: MarketStock[],
    currency_values: MarketCurrencyRates
  ): Observable<AllDataInterface> {
    this.all_data_object.user_stocks = user_stocks;
    this.all_data_object.user_taxes = user_taxes;
    this.all_data_object.user_accounts = user_accounts;
    this.all_data_object.market_stocks = market_stocks;
    this.all_data_object.currency_values = currency_values;

    this.getTaxRates();
    this.calcStockTotals();
    this.calcTaxes();
    this.calcAccounts(user_accounts, currency_values);
    this.calcSummary();
    this.logger.obj(this.all_data_object);
    return of(this.all_data_object);
  }

  private calcSummary(): void {
    this.logger.title('calcSummary');
    let all_data: AllDataInterface = this.all_data_object;
    // Reset Totals
    let reset_totals: TotalsInterface = new Totals();
    all_data.totals = reset_totals;
    // Update Totals
    //
    // Stocks
    //
    for (let i = 0, len = all_data.user_stocks.length; i < len; i++) {
      if (
        all_data.user_stocks[i].status == 'closed' ||
        all_data.user_stocks[i].status == 'open'
      ) {
        all_data.totals.stocks.all.value_euro_original +=
          all_data.user_stocks[i].value_euro_original;
        all_data.totals.stocks.all.value_euro_current +=
          all_data.user_stocks[i].value_euro_current;

        if (all_data.user_stocks[i].status == 'closed') {
          all_data.totals.stocks.closed.value_euro_original +=
            all_data.user_stocks[i].value_euro_original;
          all_data.totals.stocks.closed.value_euro_current +=
            all_data.user_stocks[i].value_euro_current;
          all_data.totals.stocks.closed.tax_due +=
            all_data.user_stocks[i].tax_due;
        }

        if (all_data.user_stocks[i].status == 'open') {
          all_data.totals.stocks.open.value_euro_original +=
            all_data.user_stocks[i].value_euro_original;
          all_data.totals.stocks.open.value_euro_current +=
            all_data.user_stocks[i].value_euro_current;
          all_data.totals.stocks.open.tax_due +=
            all_data.user_stocks[i].tax_due;
        }
      }
    }
    //
    // All Stocks
    //
    // Tax Due
    all_data.totals.stocks.all.tax_due =
      all_data.totals.stocks.open.tax_due +
      all_data.totals.stocks.closed.tax_due;
    // Update change in Totals
    all_data.totals.stocks.all.value_euro_change =
      all_data.totals.stocks.all.value_euro_current -
      all_data.totals.stocks.all.value_euro_original;
    // change as percent
    all_data.totals.stocks.all.value_euro_change_percent = this.percentChange(
      all_data.totals.stocks.all.value_euro_current,
      all_data.totals.stocks.all.value_euro_original
    );
    // Value current post tax
    all_data.totals.stocks.all.value_euro_current_post_tax =
      all_data.totals.stocks.all.value_euro_current -
      all_data.totals.stocks.all.tax_due;
    // Change after Tax
    all_data.totals.stocks.all.value_euro_change_post_tax =
      all_data.totals.stocks.all.value_euro_current -
      all_data.totals.stocks.all.tax_due -
      all_data.totals.stocks.all.value_euro_original;
    // Change after Tax as percent
    let value_euro_current_less_tax =
      all_data.totals.stocks.all.value_euro_current -
      all_data.totals.stocks.all.tax_due;
    // change as percent
    all_data.totals.stocks.all.value_euro_change_post_tax_percent =
      this.percentChange(
        value_euro_current_less_tax,
        all_data.totals.stocks.all.value_euro_original
      );
    //
    // Closed Stocks
    //
    // Update change in Totals
    all_data.totals.stocks.closed.value_euro_change =
      all_data.totals.stocks.closed.value_euro_current -
      all_data.totals.stocks.closed.value_euro_original;
    // change as percent
    all_data.totals.stocks.closed.value_euro_change_percent =
      this.percentChange(
        all_data.totals.stocks.closed.value_euro_current,
        all_data.totals.stocks.closed.value_euro_original
      );
    // Value current post tax
    all_data.totals.stocks.closed.value_euro_current_post_tax =
      all_data.totals.stocks.closed.value_euro_current -
      all_data.totals.stocks.closed.tax_due;
    // Change after Tax
    all_data.totals.stocks.closed.value_euro_change_post_tax =
      all_data.totals.stocks.closed.value_euro_current -
      all_data.totals.stocks.closed.tax_due -
      all_data.totals.stocks.closed.value_euro_original;
    // Change after Tax as percent
    let closed_value_euro_current_less_tax =
      all_data.totals.stocks.closed.value_euro_current -
      all_data.totals.stocks.closed.tax_due;
    // change as percent
    all_data.totals.stocks.closed.value_euro_change_post_tax_percent =
      this.percentChange(
        closed_value_euro_current_less_tax,
        all_data.totals.stocks.closed.value_euro_original
      );
    //
    // Open Stocks
    //
    // Update change in Totals
    all_data.totals.stocks.open.value_euro_change =
      all_data.totals.stocks.open.value_euro_current -
      all_data.totals.stocks.open.value_euro_original;
    // change as percent
    all_data.totals.stocks.open.value_euro_change_percent = this.percentChange(
      all_data.totals.stocks.open.value_euro_current,
      all_data.totals.stocks.open.value_euro_original
    );
    // Value current post tax
    all_data.totals.stocks.open.value_euro_current_post_tax =
      all_data.totals.stocks.open.value_euro_current -
      all_data.totals.stocks.open.tax_due;
    // Change after Tax
    all_data.totals.stocks.open.value_euro_change_post_tax =
      all_data.totals.stocks.open.value_euro_current -
      all_data.totals.stocks.open.tax_due -
      all_data.totals.stocks.open.value_euro_original;
    // Change after Tax as percent
    let open_value_euro_current_less_tax =
      all_data.totals.stocks.open.value_euro_current -
      all_data.totals.stocks.open.tax_due;
    // change as percent
    all_data.totals.stocks.open.value_euro_change_post_tax_percent =
      this.percentChange(
        open_value_euro_current_less_tax,
        all_data.totals.stocks.open.value_euro_original
      );
    //
    // Accounts
    //
    this.all_data_object.totals.accounts.value_euro_current =
      this.accounts_total_euro;
    //
    // All
    //
    this.all_data_object.totals.all.all.value_euro_original =
      this.all_data_object.totals.stocks.all.value_euro_original +
      this.all_data_object.totals.accounts.value_euro_current;
    this.all_data_object.totals.all.all.value_euro_current =
      this.all_data_object.totals.stocks.all.value_euro_current +
      this.all_data_object.totals.accounts.value_euro_current;
    // Tax Due
    this.all_data_object.totals.all.all.tax_due =
      all_data.totals.stocks.open.tax_due +
      all_data.totals.stocks.closed.tax_due;
    // Update change in Totals
    this.all_data_object.totals.all.all.value_euro_change =
      all_data.totals.all.all.value_euro_current -
      all_data.totals.all.all.value_euro_original;
    // change as percent
    this.all_data_object.totals.all.all.value_euro_change_percent =
      this.percentChange(
        all_data.totals.all.all.value_euro_current,
        all_data.totals.all.all.value_euro_original
      );
    // Value current post tax
    this.all_data_object.totals.all.all.value_euro_current_post_tax =
      all_data.totals.all.all.value_euro_current -
      all_data.totals.all.all.tax_due;
    // Change after Tax
    this.all_data_object.totals.all.all.value_euro_change_post_tax =
      all_data.totals.all.all.value_euro_current -
      all_data.totals.all.all.tax_due -
      all_data.totals.all.all.value_euro_original;
    // Change after Tax as percent
    let all_value_euro_current_less_tax =
      all_data.totals.all.all.value_euro_current -
      all_data.totals.all.all.tax_due;
    // change as percent
    this.all_data_object.totals.all.all.value_euro_change_post_tax_percent =
      this.percentChange(
        all_value_euro_current_less_tax,
        all_data.totals.all.all.value_euro_original
      );
  }

  private calcAccounts(user_accounts, currency_values): void {
    this.logger.title('calcAccounts');
    this.convertCurrency(user_accounts, currency_values);
  }

  private convertCurrency(user_accounts, currency_values): void {
    this.accounts_total_euro = 0;
    if (user_accounts.length > 0) {
      for (let i = 0, len = user_accounts.length; i < len; i++) {
        user_accounts[i].balance_euro =
          user_accounts[i].balance /
          currency_values[user_accounts[i].currency].current;
        this.accounts_total_euro += user_accounts[i].balance_euro;
        let currency_symbol = this.getCurrencySymbol(user_accounts[i].currency);
        user_accounts[i].currency_symbol = currency_symbol;
      }
    }
  }

  private getCurrencySymbol(currency): string {
    let cur: CurrencyDefault = this.default_currencies.find(
      (x) => x.id === currency
    );
    let currency_symbol = cur.symbol;
    return currency_symbol;
  }

  private getTaxRates(): void {
    this.logger.title('getTaxRates');
    let cgt_tax = this.user_taxes.filter(
      (a) => a.tax_type.toUpperCase() === 'CGT'
    );
    if (cgt_tax.length > 0) {
      this.personal_exemption_current = +cgt_tax[0].credit;
      this.personal_tax_rate = +cgt_tax[0].rate;
      this.logger.log(
        'personal_exemption_current',
        this.personal_exemption_current
      );
      this.logger.log('personal_tax_rate', this.personal_tax_rate);
    }
  }

  private calcStockTotals(): void {
    this.logger.title('calcStockTotals');
    this.tax_chargeable_gain_positive_total_closed = 0;
    this.tax_chargeable_gain_negative_total_closed = 0;
    this.tax_chargeable_gain_total_closed = 0;
    this.tax_chargeable_gain_positive_total_open = 0;
    this.tax_chargeable_gain_negative_total_open = 0;
    this.tax_chargeable_gain_total_open = 0;
    this.tax_taxable_gain_open = 0;
    this.tax_taxable_gain_closed = 0;

    let all_data: AllDataInterface = this.all_data_object;

    for (let i = 0, len = all_data.user_stocks.length; i < len; i++) {
      let res = this.calcTotal(i, all_data);
      all_data.user_stocks[i] = res;
      // Update Totals
      if (
        all_data.user_stocks[i].status == 'closed' ||
        all_data.user_stocks[i].status == 'open'
      ) {
        this.logger.log(all_data.user_stocks[i].value_euro_original);
        this.logger.log(all_data.user_stocks[i].value_euro_current);
        this.logger.log('ORIG', all_data.totals.stocks.all.value_euro_original);
        this.logger.log(
          'CURRENT',
          all_data.totals.stocks.all.value_euro_current
        );
      }
    }
  }

  private calcTotal(stock_index, all_data): UserStock {
    this.logger.log('calcTotal', stock_index);
    let s_new: UserStock = { ...all_data.user_stocks[stock_index] };
    s_new.currency_rate_current =
      all_data.currency_values[s_new.currency].current;
    if (s_new.status === 'closed' || s_new.status === 'archived') {
      // Use the close price and forex
      s_new.value_euro_current =
        +s_new.price_close * +s_new.forex_close * +s_new.amount;
      s_new.price_change = +s_new.price_close - +s_new.price;
      s_new.price_change_percent = this.percentChange(
        +s_new.price_close,
        +s_new.price
      );
    } else if (s_new.status === 'open') {
      // Find the current price
      let market_stock: MarketStock = all_data.market_stocks.find(
        (x) => x.symbol.toUpperCase() === s_new.ticker.toUpperCase()
      );
      let price_current = market_stock.regularMarketPrice;
      s_new.price_current = price_current;
      s_new.value_euro_current =
        (price_current / s_new.currency_rate_current) * +s_new.amount;
    }

    s_new.price_original_euro = +s_new.price * +s_new.forex * +s_new.amount;
    s_new.value_euro_original = +s_new.price * +s_new.forex * +s_new.amount;

    s_new.value_euro_change =
      s_new.value_euro_current - s_new.value_euro_original;
    s_new.value_euro_change_percent = this.percentChange(
      s_new.value_euro_current,
      s_new.value_euro_original
    );

    s_new.price_current_euro =
      (+s_new.price / s_new.currency_rate_current) * +s_new.amount;
    s_new.original_cost_euro = s_new.price_original_euro + +s_new.fee;
    s_new.fx_change = s_new.price_current_euro - s_new.price_original_euro;
    s_new.fx_change_percent =
      (s_new.fx_change / s_new.price_original_euro) * 100;
    s_new.tax_chargeable_gain =
      s_new.value_euro_current - s_new.value_euro_original - +s_new.fee;

    // Chargeable gain positive, negative, and total for Open and Closed
    if (s_new.status == 'closed') {
      if (s_new.tax_chargeable_gain > 0) {
        this.tax_chargeable_gain_positive_total_closed +=
          s_new.tax_chargeable_gain;
      } else {
        this.tax_chargeable_gain_negative_total_closed +=
          s_new.tax_chargeable_gain;
      }
      this.tax_chargeable_gain_total_closed += s_new.tax_chargeable_gain;
    }

    if (s_new.status == 'open') {
      if (s_new.tax_chargeable_gain > 0) {
        this.tax_chargeable_gain_positive_total_open +=
          s_new.tax_chargeable_gain;
      } else {
        this.tax_chargeable_gain_negative_total_open +=
          s_new.tax_chargeable_gain;
      }
      this.tax_chargeable_gain_total_open += s_new.tax_chargeable_gain;
    }
    return s_new;
  }

  // TAX

  // chargeable gain	= sale price - (purchase price + allowable expenses)
  // taxable gain	= chargeable gain - (personal exemption + allowable losses)

  private calcTaxes(): void {
    this.logger.title('calcTaxes');
    this.logger.log(
      'tax_chargeable_gain_positive_total_closed',
      this.tax_chargeable_gain_positive_total_closed
    );
    this.logger.log(
      'tax_chargeable_gain_negative_total_closed',
      this.tax_chargeable_gain_negative_total_closed
    );
    this.logger.log(
      'tax_chargeable_gain_total_closed',
      this.tax_chargeable_gain_total_closed
    );
    this.logger.log(
      'tax_chargeable_gain_positive_total_open',
      this.tax_chargeable_gain_positive_total_open
    );
    this.logger.log(
      'tax_chargeable_gain_negative_total_open',
      this.tax_chargeable_gain_negative_total_open
    );
    this.logger.log(
      'tax_chargeable_gain_total_open',
      this.tax_chargeable_gain_total_open
    );
    this.logger.title('CLOSED - Start');
    this.logger.log(
      'tax_chargeable_gain_total_closed',
      this.tax_chargeable_gain_total_closed
    );
    this.logger.log('allowable_loss', this.allowable_loss);
    this.logger.log(
      'personal_exemption_current',
      this.personal_exemption_current
    );
    this.logger.log('tax_taxable_gain_closed', this.tax_taxable_gain_closed);
    //
    // CLOSED
    //
    // tax_chargeable_gain_total_closed (already deducts closed losses)
    if (this.tax_chargeable_gain_total_closed < 0) {
      // LOSS
      this.allowable_loss = this.tax_chargeable_gain_total_closed * -1;
      this.tax_taxable_gain_closed = 0;
      // Set the loss as Allowable Loss (For Open Stocks)
      // taxable gain 0
    } else {
      // PROFIT
      if (
        this.tax_chargeable_gain_total_closed > this.personal_exemption_current
      ) {
        // Chargeable gain greater than personal exemption;
        // taxable gain  = chargeable gain - exemption
        // exmption used up (0)
        this.tax_taxable_gain_closed =
          this.tax_chargeable_gain_total_closed -
          this.personal_exemption_current;
        this.personal_exemption_current = 0;
      } else {
        // Chargeable gain less than personal exemption;
        // Deduct used exemption;
        // exemption = exemption - chargeable gain
        // taxable gain 0
        this.personal_exemption_current =
          this.personal_exemption_current -
          this.tax_chargeable_gain_total_closed;
        this.tax_taxable_gain_closed = 0;
      }
    }
    this.logger.title('CLOSED - End');
    this.logger.log(
      'tax_chargeable_gain_total_closed',
      this.tax_chargeable_gain_total_closed
    );
    this.logger.log('allowable_loss', this.allowable_loss);
    this.logger.log(
      'personal_exemption_current',
      this.personal_exemption_current
    );
    this.logger.log('tax_taxable_gain_closed', this.tax_taxable_gain_closed);
    this.logger.title('OPEN - Start');
    this.logger.log(
      'tax_chargeable_gain_total_open',
      this.tax_chargeable_gain_total_open
    );
    this.logger.log('allowable_loss', this.allowable_loss);
    this.logger.log(
      'personal_exemption_current',
      this.personal_exemption_current
    );
    this.logger.log('tax_taxable_gain_open', this.tax_taxable_gain_open);
    //
    // OPEN
    //
    if (this.tax_chargeable_gain_total_open < 0) {
      //LOSS
      this.allowable_loss += this.tax_chargeable_gain_total_open;
      this.tax_taxable_gain_open = 0;
    } else {
      // PROFIT
      // ALLOWABLE LOSS (FIRST) (Allowable Loss from Closed)
      if (this.tax_chargeable_gain_total_open > this.allowable_loss) {
        // Chargeanble gain greater than Allowable Loss
        // taxable gain  = chargeable gain - allowable loss
        // Allowable loss used up (0)
        this.tax_taxable_gain_open =
          this.tax_chargeable_gain_total_open - this.allowable_loss;
        this.allowable_loss = 0;
      } else {
        // Chargeanble gain less than Allowable Loss
        // Deduct used Allowable Loss;
        // allowable loss = allowable loss - chargeable gain
        // taxable gain 0
        this.allowable_loss =
          this.allowable_loss - this.tax_chargeable_gain_total_open;
        this.tax_taxable_gain_open = 0;
      }
      // PERSONAL EXEMPTION (SECOND)
      if (
        this.tax_chargeable_gain_total_open > this.personal_exemption_current
      ) {
        // Chargeable gain greater than personal exemption;
        // taxable gain  = chargeable gain - exemption
        // exmption used up (0)
        this.tax_taxable_gain_open =
          this.tax_chargeable_gain_total_open - this.personal_exemption_current;
        this.personal_exemption_current = 0;
      } else {
        // Chargeable gain less than personal exemption;
        // Deduct used exemption;
        // exemption = exemption - chargeable gain
        // taxable gain 0
        this.personal_exemption_current =
          this.personal_exemption_current - this.tax_chargeable_gain_total_open;
        this.tax_taxable_gain_open = 0;
      }
    }
    this.logger.title('OPEN - END');
    this.logger.log(
      'tax_chargeable_gain_total_open',
      this.tax_chargeable_gain_total_open
    );
    this.logger.log('allowable_loss', this.allowable_loss);
    this.logger.log(
      'personal_exemption_current',
      this.personal_exemption_current
    );
    this.logger.log('tax_taxable_gain_open', this.tax_taxable_gain_open);
    this.logger.title('TAXABLE GAINS');
    this.logger.log(
      'personal_exemption_current',
      this.personal_exemption_current
    );
    this.logger.log('allowable_loss', this.allowable_loss);
    this.logger.log('tax_taxable_gain_closed', this.tax_taxable_gain_closed);
    this.logger.log('tax_taxable_gain_open', this.tax_taxable_gain_open);

    let all_data = this.all_data_object;

    for (let i = 0, len = all_data.user_stocks.length; i < len; i++) {
      let res = this.calcTax(i, all_data);
      all_data.user_stocks[i] = res;
    }
  }

  private calcTax(stock_index, all_data): UserStock {
    this.logger.log('calcTax', stock_index);
    let s_new: UserStock = { ...all_data.user_stocks[stock_index] };

    if (s_new.status == 'closed' || s_new.status == 'archived') {
      if (s_new.tax_chargeable_gain > 0) {
        s_new.tax_positive_percent =
          s_new.tax_chargeable_gain /
          this.tax_chargeable_gain_positive_total_closed;
        s_new.tax_taxable_gain =
          this.tax_taxable_gain_closed * s_new.tax_positive_percent;
      } else {
        s_new.tax_taxable_gain = 0;
      }
    }

    if (s_new.status == 'open') {
      if (s_new.tax_chargeable_gain > 0) {
        s_new.tax_positive_percent =
          s_new.tax_chargeable_gain /
          this.tax_chargeable_gain_positive_total_open;
        s_new.tax_taxable_gain =
          this.tax_taxable_gain_open * s_new.tax_positive_percent;
      } else {
        s_new.tax_taxable_gain = 0;
      }
    }

    if (
      s_new.status === 'open' ||
      s_new.status === 'closed' ||
      s_new.status == 'archived'
    ) {
      s_new.tax_due = s_new.tax_taxable_gain * (this.personal_tax_rate / 100);
    }

    s_new.value_euro_change_post_tax =
      s_new.value_euro_change - s_new.tax_due - +s_new.fee;

    s_new.value_euro_current_post_tax =
      s_new.value_euro_current - (s_new.tax_due + +s_new.fee);

    s_new.value_euro_change_post_tax_percent =
      ((s_new.value_euro_current_post_tax - s_new.value_euro_original) /
        s_new.value_euro_original) *
      100;

    return s_new;
  }

  startPolling(): void {
    this.logger.log('startPolling');
    if (!this.debug.POLLING && this.userIsAuthenticated) {
      // Unsub any previous sub before subcribing
      if (this.timerSub != undefined) {
        this.timerSub.unsubscribe();
      }
      this.timerSub = timer(
        this.polling_settings.initial_delay,
        this.polling_settings.period
      ).subscribe(() => {
        this.getPollData();
      });
    }
  }

  stopPolling(): void {
    this.logger.log('stopPolling');
    if (this.timerSub != undefined) {
      this.timerSub.unsubscribe();
    }
  }

  restartPolling(): void {
    this.logger.log('restartPolling');
    this.startPolling();
  }
}
