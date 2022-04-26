export interface Currency {
  value: string;
  viewValue: string;
}

export interface MarketCurrency {
  'Realtime Currency Exchange Rate'?: {
    '1. From_Currency Code'?: string;
    '2. From_Currency Name'?: string;
    '3. To_Currency Code'?: string;
    '4. To_Currency Name'?: string;
    '5. Exchange Rate'?: string;
    '6. Last Refreshed'?: string;
    '7. Time Zone'?: string;
    '8. Bid Price'?: string;
    '9. Ask Price'?: string;
  };
}

export interface MarketCurrencyServer {
  message?: string;
  currency?: MarketCurrency;
}

export interface MarketCurrencyObservable {
  TO?: any;
  RATE?: any;
  error?: any;
}

export interface MarketCurrencyRates {
  [key: string]: {
    current: number;
    last: number;
  };
}

export interface MarketSummaryCurrency {
  currency: string;
  symbol: string;
  rate: any;
  euro: number;
  last: any;
}
