import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Subject, of, forkJoin, Observable, catchError } from 'rxjs';
import { DEBUG, MARKET_CURRENCY } from './../../settings/debug';
import {
  MarketCurrencyServer,
  MarketCurrencyObservable,
  MarketCurrencyRates,
} from '../currency-market/currency.market.model';

const BACKEND_URL: string = environment.apiUrl + '/market-currency/';

@Injectable({ providedIn: 'root' })
export class CurrencyMarketService {
  private debug = DEBUG;
  private debug_market_currency: MarketCurrencyServer[] = MARKET_CURRENCY;
  private last_to: string;
  private last_rate: number;

  constructor(private http: HttpClient) {}

  getCurrencies(currencies: string[]): Observable<MarketCurrencyRates> {
    let currency_rates: MarketCurrencyRates = { EUR: { current: 0, last: 0 } };
    let currency_pairs: string[][] = [];
    var subject = new Subject<MarketCurrencyRates>();

    currency_pairs = currencies
      .filter((currency) => currency != 'EUR')
      .map((currency) => ['EUR', currency]);
    forkJoin(currency_pairs.map((i) => this.getMarketCurrency(i))).subscribe(
      (response) => {
        response.map((currencyData: MarketCurrencyObservable) => {
          if (currencyData.error) {
            return;
          }
          let currency_to = currencyData.TO;
          let currency_rate = currencyData.RATE;
          currency_rates[currency_to] = {
            current: currency_rate,
            last: currency_rate,
          };
        });
        currency_rates['EUR'] = { current: 1, last: 1 };
        subject.next(currency_rates);
      }
    );
    if (this.debug.MARKET) {
      return of(currency_rates);
    } else {
      return subject.asObservable();
    }
  }

  private getMarketCurrency(
    currency_pair: string[]
  ): Observable<MarketCurrencyObservable> {
    if (this.debug.MARKET) {
      let currency_to_match = this.debug_market_currency.find(
        (x) =>
          x.currency['Realtime Currency Exchange Rate'][
            '3. To_Currency Code'
          ] === currency_pair[1]
      );
      if (
        currency_to_match == undefined ||
        currency_to_match['message'] != 'Currency loaded successfully'
      ) {
        let error = new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: {
            message: 'mcurrency_error_general',
            params: currency_pair,
          },
        });
        throw error;
      } else {
        let marketCurrencyData = {
          TO: currency_to_match.currency['Realtime Currency Exchange Rate'][
            '3. To_Currency Code'
          ],
          RATE: currency_to_match.currency['Realtime Currency Exchange Rate'][
            '5. Exchange Rate'
          ],
        };
        return of(marketCurrencyData);
      }
    } else {
      var currencyData = new FormData();
      currencyData.append('currency_1', currency_pair[0]);
      currencyData.append('currency_2', currency_pair[1]);
      let headers = new Headers();
      headers.append(
        'Content-Type',
        'multipart/form-data;boundary=' + Math.random()
      );
      headers.append('Accept', 'application/json');
      return this.http
        .post<MarketCurrencyServer>(BACKEND_URL, currencyData)
        .pipe(
          map((currencyData: MarketCurrencyServer) => {
            // Check that currency rate loaded, if not return last loaded
            if (currencyData.currency['Realtime Currency Exchange Rate']) {
              this.last_to =
                currencyData.currency['Realtime Currency Exchange Rate'][
                  '3. To_Currency Code'
                ];
              this.last_rate =
                +currencyData.currency['Realtime Currency Exchange Rate'][
                  '5. Exchange Rate'
                ];
            } else {
              console.log('currency error!');
            }
            return {
              TO: this.last_to,
              RATE: this.last_rate,
            };
          }),
          catchError((error) => {
            throw error;
          })
        );
    }
  }
}
