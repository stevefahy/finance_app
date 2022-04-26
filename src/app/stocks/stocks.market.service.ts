import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MarketStock,
  MarketStockServer,
  MarketStockServerObservable,
  MarketStockServerExistsObservable,
} from './stocks.market.model';
import { DEBUG, MARKET_STOCKS } from './../settings/debug';

const BACKEND_URL: string = environment.apiUrl + '/market-stocks/';

@Injectable({ providedIn: 'root' })
export class StocksMarketService {
  private debug = DEBUG;
  private debug_market_stock = MARKET_STOCKS;

  constructor(private http: HttpClient) {}

  getMarketStocksData(ticker: string): Observable<MarketStockServerObservable> {
    if (this.debug.MARKET) {
      let stocks_array: string[] = [];
      if (ticker.length > 0) {
        stocks_array = ticker.split(',');
      }
      let user_stocks_open = [];
      let stocks_not_found = [];
      for (let i = 0; i < stocks_array.length; i++) {
        let found = this.debug_market_stock.stock.quoteResponse.result.filter(
          (a) => a.symbol === stocks_array[i].toUpperCase()
        );
        if (found.length > 0) {
          user_stocks_open.push(found[0]);
        } else {
          stocks_not_found.push(stocks_array[i]);
        }
      }
      // If any stocks were not found then throw an error
      if (stocks_not_found.length > 0) {
        const error = new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: {
            message: 'mstock_error_no_stock_found',
            params: stocks_not_found,
          },
        });
        return of(error);
      }
      return of({ stocks: user_stocks_open });
    } else {
      var stockMarketData = new FormData();
      stockMarketData.append('ticker', ticker);
      let headers = new Headers();
      headers.append(
        'Content-Type',
        'multipart/form-data;boundary=' + Math.random()
      );
      headers.append('Accept', 'application/json');
      return this.http
        .post<MarketStockServer>(BACKEND_URL, stockMarketData)
        .pipe(
          map((stockMarketData: MarketStockServer) => {
            return {
              stocks: stockMarketData.stock.quoteResponse.result.map(
                (stock: MarketStock) => {
                  return {
                    symbol: stock.symbol,
                    currency: stock.currency,
                    name: stock.longName,
                    regularMarketPrice: stock.regularMarketPrice,
                    regularMarketChange: stock.regularMarketChange,
                    regularMarketChangePercent:
                      stock.regularMarketChangePercent,
                    regularMarketPreviousClose:
                      stock.regularMarketPreviousClose,
                  };
                }
              ),
            };
          }),
          catchError((error) => {
            return of(error);
          })
        );
    }
  }

  // Check whether the ticker is a valid stock ticker
  checkMarketStock(
    ticker: string
  ): Observable<MarketStockServerExistsObservable> {
    let stock_exists: boolean = false;
    if (this.debug.MARKET) {
      let stock = ticker;
      let found = this.debug_market_stock.stock.quoteResponse.result.filter(
        (a) => a.symbol.toUpperCase() === stock.toUpperCase()
      );
      if (found.length > 0) {
        stock_exists = true;
      }
      return of({ valid: stock_exists });
    } else {
      var stockMarketData = new FormData();
      stockMarketData.append('ticker', ticker);
      let headers = new Headers();
      headers.append(
        'Content-Type',
        'multipart/form-data;boundary=' + Math.random()
      );
      headers.append('Accept', 'application/json');
      return this.http
        .post<MarketStockServer>(BACKEND_URL, stockMarketData)
        .pipe(
          map((stockMarketData: MarketStockServer) => {
            if (stockMarketData.stock.quoteResponse.result.length > 0) {
              stock_exists = true;
            }
            return {
              valid: stock_exists,
            };
          })
        );
    }
  }
}
