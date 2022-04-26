export interface UserStock {
  _id: string;
  user?: string;
  status?: string;
  ticker: string;
  price: string;
  price_current?: number;
  price_change?: number;
  price_change_percent?: number;
  price_original_euro?: number;
  price_current_euro?: number;
  price_close?: string;
  currency: string;
  forex: string;
  forex_close?: string;
  amount: string;
  fee: string;
  dividend_yield: string;
  date_start: string;
  date_end: string;
  value_euro_original?: number;
  value_euro_current?: number;
  value_euro_change?: number;
  value_euro_change_percent?: number;
  value_euro_current_post_tax?: number;
  value_euro_change_post_tax?: number;
  value_euro_change_post_tax_percent?: number;
  tax_due?: number;
  currency_rate_current?: number;
  original_cost_euro?: number;
  fx_change?: number;
  fx_change_percent?: number;
  tax_chargeable_gain?: number;
  tax_positive_percent?: number;
  tax_taxable_gain?: number;
}

export interface UserStockObservable {
  stockUserData: UserStock[];
}

export interface UserStockServer {
  message: string;
  stocks: UserStock[];
}
