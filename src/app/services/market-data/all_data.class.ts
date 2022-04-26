import { UserStock } from '../../stocks/stocks.user.model';
import { UserTax } from '../../tax/tax.model';
import { UserAccount } from '../../accounts/account.model';
import { MarketCurrencyRates } from '../../services/currency-market/currency.market.model';
import { MarketStock } from '../../stocks/stocks.market.model';
import {
  Stocks,
  Account,
  TotalsInterface,
  AllDataInterface,
  Alls,
} from './all_data.model';

export class Totals implements TotalsInterface {
  all: Alls = {
    all: {
      value_euro_original: 0,
      value_euro_current: 0,
      value_euro_change: 0,
      value_euro_change_percent: 0,
      value_euro_current_post_tax: 0,
      value_euro_change_post_tax: 0,
      value_euro_change_post_tax_percent: 0,
      tax_due: 0,
    },
  };
  stocks: Stocks = {
    all: {
      value_euro_original: 0,
      value_euro_current: 0,
      value_euro_change: 0,
      value_euro_change_percent: 0,
      value_euro_current_post_tax: 0,
      value_euro_change_post_tax: 0,
      value_euro_change_post_tax_percent: 0,
      tax_due: 0,
    },
    open: {
      value_euro_original: 0,
      value_euro_current: 0,
      value_euro_change: 0,
      value_euro_change_percent: 0,
      value_euro_current_post_tax: 0,
      value_euro_change_post_tax: 0,
      value_euro_change_post_tax_percent: 0,
      tax_due: 0,
    },
    closed: {
      value_euro_original: 0,
      value_euro_current: 0,
      value_euro_change: 0,
      value_euro_change_percent: 0,
      value_euro_current_post_tax: 0,
      value_euro_change_post_tax: 0,
      value_euro_change_post_tax_percent: 0,
      tax_due: 0,
    },
  };
  accounts: Account = {
    value_euro_current: 0,
  };
}

export class AllData implements AllDataInterface {
  user_stocks: UserStock[] = [];
  user_accounts: UserAccount[] = [];
  user_taxes: UserTax[] = [];
  market_stocks: MarketStock[] = [];
  currency_values: MarketCurrencyRates;
  totals: TotalsInterface = new Totals();
}
