import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, first } from 'rxjs/operators';
import { of, ReplaySubject, Subscription, Observable } from 'rxjs';
import {
  UserAccount,
  UserAccountObservable,
  UserAccountServer,
} from './account.model';
import { AuthService } from '../auth/auth.service';
import { DEBUG, ACCOUNTS } from '../settings/debug';

const BACKEND_URL: string = environment.apiUrl + '/user-account/';

@Injectable({ providedIn: 'root' })
export class AccountUserService {
  private userId: string;
  public userIsAuthenticated: boolean = false;
  public allAccountUpdated: ReplaySubject<UserAccountObservable> =
    new ReplaySubject<UserAccountObservable>(1);
  private debug = DEBUG;
  private debug_account = ACCOUNTS;
  private authListenerSubs: Subscription;

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

  getAllAccountUpdatedistener(): Observable<UserAccountObservable> {
    return this.allAccountUpdated.asObservable();
  }

  getUserAccount(id: string): Observable<UserAccountServer> {
    return this.http.get<UserAccountServer>(BACKEND_URL + id);
  }

  getUserAccountData(): Observable<UserAccount[]> {
    let current_accounts: UserAccount[];
    if (this.debug.USER) {
      current_accounts = this.debug_account;
      this.allAccountUpdated.next({
        accountData: current_accounts,
      });
      return of(current_accounts);
    } else {
      return this.http
        .get<UserAccountServer>(BACKEND_URL, {
          params: {
            userId: this.userId,
          },
        })
        .pipe(
          map((accountData: UserAccountServer) => {
            current_accounts = accountData.accounts.map((account) => {
              return {
                _id: account._id,
                name: account.name,
                balance: account.balance,
                currency: account.currency,
                date_start: account.date_start,
                date_end: account.date_end,
              };
            });
            this.allAccountUpdated.next({
              accountData: current_accounts,
            });
            return current_accounts;
          })
        );
    }
  }

  addAccount(
    name: string,
    balance: string,
    currency: string,
    date_start: string,
    date_end: string
  ): void {
    var accountData = new FormData();
    accountData.append('name', name);
    accountData.append('balance', balance);
    accountData.append('currency', currency);
    accountData.append('date_start', date_start);
    accountData.append('date_end', date_end);
    accountData.append('user', this.userId);
    let headers = new Headers();
    headers.append(
      'Content-Type',
      'multipart/form-data;boundary=' + Math.random()
    );
    headers.append('Accept', 'application/json');
    const a = this.http
      .post<{ message: string; account: UserAccount }>(BACKEND_URL, accountData)
      .subscribe((val) => {
        let new_accounts = val.account;
        this.allAccountUpdated
          .pipe(first())
          .subscribe((res: UserAccountObservable) => {
            let updated_accounts = [...res.accountData, new_accounts];
            let useraccountData = updated_accounts;
            this.allAccountUpdated.next({
              accountData: useraccountData,
            });
          });
      });
  }

  updateAccount(
    _id: string,
    name: string,
    balance: string,
    currency: string,
    date_start: string,
    date_end: string
  ): void {
    var accountData = new FormData();
    accountData.append('name', name);
    accountData.append('balance', balance);
    accountData.append('currency', currency);
    accountData.append('date_start', date_start);
    accountData.append('date_end', date_end);
    accountData.append('user', this.userId);
    let headers = new Headers();
    headers.append(
      'Content-Type',
      'multipart/form-data;boundary=' + Math.random()
    );
    headers.append('Accept', 'application/json');
    let update = {
      _id: _id,
      name: name,
      balance: balance,
      currency: currency,
      date_start: date_start,
      date_end: date_end,
      user: this.userId,
    };
    const a = this.http
      .put<{ message: string; account: UserAccount }>(
        BACKEND_URL + _id,
        accountData
      )
      .subscribe((data) => {
        this.allAccountUpdated
          .pipe(first())
          .subscribe((res: UserAccountObservable) => {
            let updated_accounts = [...res.accountData];
            let index = updated_accounts.findIndex((x) => x._id === update._id);
            updated_accounts[index] = update;
            let useraccountData = updated_accounts;
            this.allAccountUpdated.next({
              accountData: useraccountData,
            });
          });
      });
  }

  deleteAccount(accountId: string): void {
    this.http
      .delete<{ message: string; account: UserAccount }>(
        BACKEND_URL + accountId
      )
      .subscribe((data) => {
        this.allAccountUpdated
          .pipe(first())
          .subscribe((res: UserAccountObservable) => {
            let updated_accounts = [...res.accountData];
            let index = updated_accounts.findIndex((x) => x._id === accountId);
            updated_accounts.splice(index, 1);
            let useraccountData = updated_accounts;
            this.allAccountUpdated.next({
              accountData: useraccountData,
            });
          });
      });
  }
}
