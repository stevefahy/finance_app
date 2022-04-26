import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { StocksUserService } from '../stocks.user.service';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { Currency } from '../../services/currency-market/currency.market.model';
import { CURRENCIES, CurrencyDefault } from '../../settings/currencies';
import { StocksMarketService } from '../stocks.market.service';
import { Observable, timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import {
  StockStatus,
  StatusDropDown,
  StockStatusDropDown,
} from '../stock_status.model';
import { MarketStockServerExistsObservable } from 'src/app/stocks/stocks.market.model';

@Component({
  selector: 'stock-create',
  templateUrl: './stock-create-edit.component.html',
  styleUrls: ['./stock-create-edit.component.scss'],
})
export class StockCreateComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public mode: string = 'create';
  public hide_closed: boolean = true;
  public currency: CurrencyDefault[] = CURRENCIES;
  public currencies: Currency[] = [];
  public statuses: StatusDropDown[] = new StockStatusDropDown().statuses;
  public selected: StockStatus;
  public selected_status: StockStatus;
  public stockForm: FormGroup;
  public stockId: string;
  private status_change: number = 0;
  private current_status: StockStatus;

  constructor(
    public stocksUserService: StocksUserService,
    private marketDataService: MarketDataService,
    private stocksMarketService: StocksMarketService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Stop Polling
    this.marketDataService.stopPolling();
    // Create list of selectable currrncies from the Default Config currencies
    for (let i = 0; i < this.currency.length; i++) {
      this.currencies[i] = {
        value: this.currency[i].id,
        viewValue: this.currency[i].name,
      };
    }

    this.stockForm = new FormGroup({
      _id: new FormControl('', {}),
      ticker: new FormControl('googl', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.checkStockValidator().bind(this)],
        updateOn: 'blur',
      }),
      price: new FormControl('1024', { validators: [Validators.required] }),
      price_close: new FormControl('0', { validators: [Validators.required] }),
      currency: new FormControl('USD', { validators: [Validators.required] }),
      forex: new FormControl('0.587', { validators: [Validators.required] }),
      forex_close: new FormControl('0.587', {
        validators: [Validators.required],
      }),
      amount: new FormControl('5', { validators: [Validators.required] }),
      fee: new FormControl('1.80', { validators: [Validators.required] }),
      dividend_yield: new FormControl('0', {
        validators: [Validators.required],
      }),
      status: new FormControl('open', { validators: [Validators.required] }),
      date_start: new FormControl('2021-04-21T23:00:00.000Z', {
        validators: [Validators.required],
      }),
      date_end: new FormControl('2021-04-23T23:00:00.000Z', {
        validators: [Validators.required],
      }),
    });

    // Update validation required for close price if the status is closed
    this.stockForm.get('status').valueChanges.subscribe((status) => {
      this.status_change++;
      this.current_status = status;
      let price_close_control = this.stockForm.get('price_close');
      let forex_close_control = this.stockForm.get('forex_close');
      if (status == 'closed') {
        this.hide_closed = false;
        price_close_control.setValidators([Validators.required]);
        forex_close_control.setValidators([Validators.required]);
      } else {
        this.hide_closed = true;
        price_close_control.setValidators(null);
        forex_close_control.setValidators(null);
      }
      this.stockForm.controls['price_close'].updateValueAndValidity();
      this.stockForm.controls['forex_close'].updateValueAndValidity();
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('stockId')) {
        this.mode = 'edit';
        this.hide_closed = false;
        this.stockId = paramMap.get('stockId');
        this.stocksUserService
          .getUserStock(this.stockId)
          .subscribe((stockUserData) => {
            let stock = stockUserData.stocks[0];
            this.stockForm.patchValue({
              _id: stock._id,
              ticker: stock.ticker,
              price: stock.price,
              price_close: stock.price_close,
              currency: stock.currency,
              forex: stock.forex,
              forex_close: stock.forex_close,
              amount: stock.amount,
              fee: stock.fee,
              dividend_yield: stock.dividend_yield,
              status: stock.status,
              date_start: stock.date_start,
              date_end: stock.date_end,
            });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.marketDataService.restartPolling();
  }

  // Validate thst this stock exists
  checkStockValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return timer(0).pipe(
        switchMap(() => {
          return this.checkStockValid(this.stockForm.value.ticker).pipe(
            map((res) => {
              let x = !res.valid ? { invalidStock: true } : null;
              return x;
            })
          );
        })
      );
    };
  }

  checkStockValid(
    stock: string
  ): Observable<MarketStockServerExistsObservable> {
    return this.stocksMarketService.checkMarketStock(stock).pipe(
      tap((res) => {
        return res;
      })
    );
  }

  storeStock(): void {
    if (this.mode === 'create') {
      this.stocksUserService.addStock(
        this.stockForm.value.ticker,
        this.stockForm.value.price,
        this.stockForm.value.price_close,
        this.stockForm.value.currency,
        this.stockForm.value.forex,
        this.stockForm.value.forex_close,
        this.stockForm.value.amount,
        this.stockForm.value.fee,
        this.stockForm.value.dividend_yield,
        this.stockForm.value.status,
        new Date(this.stockForm.value.date_start).toISOString(),
        new Date(this.stockForm.value.date_end).toISOString()
      );
    } else {
      // Update Stock
      this.stocksUserService.updateStock(
        this.stockForm.value._id,
        this.stockForm.value.ticker,
        this.stockForm.value.price,
        this.stockForm.value.price_close,
        this.stockForm.value.currency,
        this.stockForm.value.forex,
        this.stockForm.value.forex_close,
        this.stockForm.value.amount,
        this.stockForm.value.fee,
        this.stockForm.value.dividend_yield,
        this.stockForm.value.status,
        new Date(this.stockForm.value.date_start).toISOString(),
        new Date(this.stockForm.value.date_end).toISOString()
      );
    }
    this.stockForm.reset();
    this.router.navigate(['']);
  }

  onSaveStock(): void {
    if (this.stockForm.invalid) {
      return;
    }
    // Check that the stock exists
    const validStock: Observable<MarketStockServerExistsObservable> =
      this.checkStockValid(this.stockForm.value.ticker).pipe(
        tap((res) => {
          return res;
        })
      );
    validStock.subscribe((res) => {
      if (!res.valid) {
        return;
      }
      this.storeStock();
    });
  }

  deleteStock(stockId: string): void {
    this.stocksUserService.deleteStock(stockId);
    this.stockForm.reset();
    this.router.navigate(['']);
  }

  cancel(): void {
    this.stockForm.reset();
    this.router.navigate(['']);
  }

  getClass() {
    // Whether to animate a change to the form status (open/closed)
    // Initial page load, don't animate
    if (this.status_change < 2) {
      if (this.current_status == 'closed') {
        return 'closed_show_initial';
      } else if (this.current_status == 'open') {
        return 'closed_hide_initial';
      }
    } else {
      // change to form, animate
      if (this.current_status == 'open') {
        return 'closed_hide_animate';
      } else if (this.current_status == 'closed') {
        return 'closed_show_animate';
      }
    }
  }
}
