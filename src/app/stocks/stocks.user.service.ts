import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  UserStock,
  UserStockObservable,
  UserStockServer,
} from './stocks.user.model';
import { AuthService } from '../auth/auth.service';
import { map, first } from 'rxjs/operators';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { DEBUG, USER_STOCKS } from './../settings/debug';

const BACKEND_URL: string = environment.apiUrl + '/user-stocks/';

@Injectable({ providedIn: 'root' })
export class StocksUserService {
  private debug = DEBUG;
  private debug_user_stock: UserStock[] = USER_STOCKS;
  private userId: string;
  public userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;

  public allStockUpdated = new ReplaySubject<UserStockObservable>(1);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  getAllStockUpdatedistener(): Observable<UserStockObservable> {
    return this.allStockUpdated;
  }

  addStock(
    ticker: string,
    price: string,
    price_close: string,
    currency: string,
    forex: string,
    forex_close: string,
    amount: string,
    fee: string,
    dividend_yield: string,
    status: string,
    date_start: string,
    date_end: string
  ): void {
    var stockUserData = new FormData();
    stockUserData.append('ticker', ticker);
    stockUserData.append('price', price);
    stockUserData.append('price_close', price_close);
    stockUserData.append('currency', currency);
    stockUserData.append('forex', forex);
    stockUserData.append('forex_close', forex_close);
    stockUserData.append('amount', amount);
    stockUserData.append('fee', fee);
    stockUserData.append('dividend_yield', dividend_yield);
    stockUserData.append('status', status);
    stockUserData.append('date_start', date_start);
    stockUserData.append('date_end', date_end);
    stockUserData.append('user', this.userId);
    let headers = new Headers();
    headers.append(
      'Content-Type',
      'multipart/form-data;boundary=' + Math.random()
    );
    headers.append('Accept', 'application/json');
    const a = this.http
      .post<{ message: string; stock: UserStock }>(BACKEND_URL, stockUserData)
      .subscribe((data) => {
        let new_stocks = data.stock;
        this.allStockUpdated.pipe(first()).subscribe((res) => {
          let updated_stocks = [...res.stockUserData, new_stocks];
          let userStockData = updated_stocks;
          this.allStockUpdated.next({
            stockUserData: userStockData,
          });
        });
      });
  }

  updateStock(
    _id: string,
    ticker: string,
    price: string,
    price_close: string,
    currency: string,
    forex: string,
    forex_close: string,
    amount: string,
    fee: string,
    dividend_yield: string,
    status: string,
    date_start: string,
    date_end: string
  ): void {
    var stockUserData = new FormData();
    stockUserData.append('_id', _id);
    stockUserData.append('ticker', ticker);
    stockUserData.append('price', price);
    stockUserData.append('price_close', price_close);
    stockUserData.append('currency', currency);
    stockUserData.append('forex', forex);
    stockUserData.append('forex_close', forex_close);
    stockUserData.append('amount', amount);
    stockUserData.append('fee', fee);
    stockUserData.append('dividend_yield', dividend_yield);
    stockUserData.append('status', status);
    stockUserData.append('date_start', date_start);
    stockUserData.append('date_end', date_end);
    stockUserData.append('user', this.userId);
    let headers = new Headers();
    headers.append(
      'Content-Type',
      'multipart/form-data;boundary=' + Math.random()
    );
    headers.append('Accept', 'application/json');
    let update = {
      _id: _id,
      ticker: ticker,
      price: price,
      price_close: price_close,
      currency: currency,
      forex: forex,
      forex_close: forex_close,
      amount: amount,
      fee: fee,
      dividend_yield: dividend_yield,
      status: status,
      date_start: date_start,
      date_end: date_end,
      user: this.userId,
    };

    const a = this.http
      .put<{ message: string; stock: UserStock }>(
        BACKEND_URL + _id,
        stockUserData
      )
      .subscribe((data) => {
        this.allStockUpdated
          .pipe(first())
          .subscribe((res: UserStockObservable) => {
            let updated_stocks = [...res.stockUserData];
            let index = updated_stocks.findIndex((x) => x._id === update._id);
            updated_stocks[index] = update;
            let userStockData = updated_stocks;
            this.allStockUpdated.next({
              stockUserData: userStockData,
            });
          });
      });
  }

  deleteStock(stockId: string): void {
    this.http.delete(BACKEND_URL + stockId).subscribe((data) => {
      this.allStockUpdated
        .pipe(first())
        .subscribe((res: UserStockObservable) => {
          let updated_stocks = [...res.stockUserData];
          let index = updated_stocks.findIndex((x) => x._id === stockId);
          updated_stocks.splice(index, 1);
          let userStockData = updated_stocks;
          this.allStockUpdated.next({
            stockUserData: userStockData,
          });
        });
    });
  }

  getUserStock(id: string): Observable<UserStockServer> {
    return this.http.get<UserStockServer>(BACKEND_URL + id);
  }

  getUserStocksData(): Observable<UserStock[]> {
    let current_stocks;
    if (this.debug.USER) {
      current_stocks = this.debug_user_stock;
      this.allStockUpdated.next({
        stockUserData: current_stocks,
      });
      return of(current_stocks);
    } else {
      return this.http
        .get<UserStockServer>(BACKEND_URL, {
          params: {
            userId: this.userId,
          },
        })
        .pipe(
          map((stockData) => {
            (current_stocks = stockData.stocks.map((stock) => {
              return {
                ticker: stock.ticker,
                price: stock.price,
                price_close: stock.price_close,
                _id: stock._id,
                currency: stock.currency,
                forex: stock.forex,
                forex_close: stock.forex_close,
                amount: stock.amount,
                fee: stock.fee,
                dividend_yield: stock.dividend_yield,
                status: stock.status,
                date_start: stock.date_start,
                date_end: stock.date_end,
              };
            })),
              this.allStockUpdated.next({
                stockUserData: current_stocks,
              });
            return current_stocks;
          })
        );
    }
  }
}
