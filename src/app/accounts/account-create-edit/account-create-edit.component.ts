import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MarketDataService } from '../../services/market-data/market.data.service';
import { AccountUserService } from '../account.user.service';
import { UserAccount } from '../account.model';
import { Currency } from '../../services/currency-market/currency.market.model';
import { CURRENCIES, CurrencyDefault } from '../../settings/currencies';

@Component({
  selector: 'app-account-create-edit',
  templateUrl: './account-create-edit.component.html',
  styleUrls: ['./account-create-edit.component.scss'],
})
export class AccountCreateEditComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public isLoading: boolean = false;
  public mode: string = 'create';
  public selected: Currency;
  public accountForm: FormGroup;
  public accountId: string;
  private account: UserAccount;
  public currency: CurrencyDefault[] = CURRENCIES;
  public currencies: Currency[] = [];

  constructor(
    public fb: FormBuilder,
    public accountUserService: AccountUserService,
    private marketDataService: MarketDataService,
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

    this.accountForm = new FormGroup({
      _id: new FormControl('', {}),
      name: new FormControl('deGiro', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      balance: new FormControl(1000, { validators: [Validators.required] }),
      currency: new FormControl('USD', { validators: [Validators.required] }),
      date_start: new FormControl('2021-04-21T23:00:00.000Z', {
        validators: [Validators.required],
      }),
      date_end: new FormControl('2021-04-23T23:00:00.000Z', {
        validators: [Validators.required],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('accountId')) {
        this.mode = 'edit';
        this.accountId = paramMap.get('accountId');
        this.accountUserService
          .getUserAccount(this.accountId)
          .subscribe((accountData) => {
            let account = accountData.accounts[0];
            this.account = {
              _id: account._id,
              name: account.name,
              balance: account.balance,
              currency: account.currency,
              date_start: account.date_start,
              date_end: account.date_end,
            };
            this.accountForm.patchValue({
              _id: account._id,
              name: account.name,
              balance: account.balance,
              currency: account.currency,
              date_start: account.date_start,
              date_end: account.date_end,
            });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.marketDataService.restartPolling();
  }

  onSaveAccount(): void {
    if (this.accountForm.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.accountUserService.addAccount(
        this.accountForm.value.name,
        this.accountForm.value.balance,
        this.accountForm.value.currency,
        new Date(this.accountForm.value.date_start).toISOString(),
        new Date(this.accountForm.value.date_end).toISOString()
      );
    } else {
      // Update Account
      this.accountUserService.updateAccount(
        this.accountForm.value._id,
        this.accountForm.value.name,
        this.accountForm.value.balance,
        this.accountForm.value.currency,
        new Date(this.accountForm.value.date_start).toISOString(),
        new Date(this.accountForm.value.date_end).toISOString()
      );
    }
    this.accountForm.reset();
    this.router.navigate(['']);
  }

  deleteAccount(accountId: string): void {
    this.accountUserService.deleteAccount(accountId);
    this.accountForm.reset();
    this.router.navigate(['']);
  }
}
