import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserTax, UserTaxObservable, UserTaxServer } from './tax.model';
import { AuthService } from '../auth/auth.service';
import { map, first } from 'rxjs/operators';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { DEBUG, TAXS } from '../settings/debug';

const BACKEND_URL: string = environment.apiUrl + '/user-tax/';

@Injectable({ providedIn: 'root' })
export class TaxUserService {
  private userId: string;
  public userIsAuthenticated: boolean = false;
  public allTaxUpdated = new ReplaySubject<UserTaxObservable>(1);
  private debug = DEBUG;
  private debug_tax = TAXS;
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

  getAllTaxUpdatedistener(): Observable<UserTaxObservable> {
    return this.allTaxUpdated.asObservable();
  }

  getUserTax(id: string): Observable<UserTaxServer> {
    return this.http.get<UserTaxServer>(BACKEND_URL + id);
  }

  getUserTaxData(): Observable<UserTax[]> {
    let current_taxes;
    if (this.debug.USER) {
      current_taxes = this.debug_tax;
      this.allTaxUpdated.next({
        taxData: current_taxes,
      });
      return of(current_taxes);
    } else {
      const queryParams = `${this.userId}`;
      return this.http
        .get<UserTaxServer>(BACKEND_URL, {
          params: {
            userId: this.userId,
          },
        })
        .pipe(
          map((taxData: UserTaxServer) => {
            current_taxes = taxData.taxs.map((tax) => {
              return {
                _id: tax._id,
                tax_type: tax.tax_type,
                credit: tax.credit,
                rate: tax.rate,
                date_start: tax.date_start,
                date_end: tax.date_end,
              };
            });
            this.allTaxUpdated.next({
              taxData: current_taxes,
            });
            return current_taxes;
          })
        );
    }
  }

  addTax(
    tax_type: string,
    rate: string,
    credit: string,
    date_start: string,
    date_end: string
  ): void {
    var taxData = new FormData();
    taxData.append('tax_type', tax_type);
    taxData.append('rate', rate);
    taxData.append('credit', credit);
    taxData.append('date_start', date_start);
    taxData.append('date_end', date_end);
    taxData.append('user', this.userId);
    let headers = new Headers();
    headers.append(
      'Content-Type',
      'multipart/form-data;boundary=' + Math.random()
    );
    headers.append('Accept', 'application/json');
    const a = this.http
      .post<{ message: string; tax: UserTax }>(BACKEND_URL, taxData)
      .subscribe((val) => {
        let new_taxes = val.tax;
        this.allTaxUpdated.pipe(first()).subscribe((res: UserTaxObservable) => {
          let updated_taxes = [...res.taxData, new_taxes];
          let userTaxData = updated_taxes;
          this.allTaxUpdated.next({
            taxData: userTaxData,
          });
        });
      });
  }

  updateTax(
    _id: string,
    tax_type: string,
    rate: string,
    credit: string,
    date_start: string,
    date_end: string
  ): void {
    var taxData = new FormData();
    taxData.append('_id', _id);
    taxData.append('tax_type', tax_type);
    taxData.append('rate', rate);
    taxData.append('credit', credit);
    taxData.append('date_start', date_start);
    taxData.append('date_end', date_end);
    taxData.append('user', this.userId);
    let headers = new Headers();
    headers.append(
      'Content-Type',
      'multipart/form-data;boundary=' + Math.random()
    );
    headers.append('Accept', 'application/json');
    let update = {
      _id: _id,
      rate: rate,
      credit: credit,
      tax_type: tax_type,
      date_start: date_start,
      date_end: date_end,
      user: this.userId,
    };
    const a = this.http
      .put<{ message: string; tax: UserTax }>(BACKEND_URL + _id, taxData)
      .subscribe((data) => {
        this.allTaxUpdated.pipe(first()).subscribe((res: UserTaxObservable) => {
          let updated_taxs = [...res.taxData];
          let index = updated_taxs.findIndex((x) => x._id === update._id);
          updated_taxs[index] = update;
          let userTaxData = updated_taxs;
          this.allTaxUpdated.next({
            taxData: userTaxData,
          });
        });
      });
  }

  deleteTax(taxId: string): void {
    this.http
      .delete<{ message: string; tax: UserTax }>(BACKEND_URL + taxId)
      .subscribe((data) => {
        this.allTaxUpdated.pipe(first()).subscribe((res: UserTaxObservable) => {
          let updated_taxs = [...res.taxData];
          let index = updated_taxs.findIndex((x) => x._id === taxId);
          updated_taxs.splice(index, 1);
          let usertaxData = updated_taxs;
          this.allTaxUpdated.next({
            taxData: usertaxData,
          });
        });
      });
  }
}
