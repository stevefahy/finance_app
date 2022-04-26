import { UserStock } from '../../stocks/stocks.user.model';
import { UserTax } from '../../tax/tax.model';
import { UserAccount } from '../..//accounts/account.model';
import { MarketStock } from '../../stocks/stocks.market.model';
import { MarketCurrencyRates } from '../../services/currency-market/currency.market.model';

export interface Account {
  value_euro_current: number;
}

export interface Alls {
  all: Total;
}

export interface TotalsInterface {
  all: Alls;
  stocks: Stocks;
  accounts: Account;
}

interface Total {
  value_euro_original: number;
  value_euro_current: number;
  value_euro_change: number;
  value_euro_change_percent: number;
  value_euro_current_post_tax: number;
  value_euro_change_post_tax: number;
  value_euro_change_post_tax_percent: number;
  tax_due: number;
}

export interface Stocks {
  all: Total;
  open: Total;
  closed: Total;
}

export interface AllDataInterface {
  user_stocks: UserStock[];
  user_taxes: UserTax[];
  user_accounts: UserAccount[];
  market_stocks: MarketStock[];
  currency_values: MarketCurrencyRates;
  totals: TotalsInterface;
}
