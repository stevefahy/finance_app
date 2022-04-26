export interface MarketStock {
  language?: string;
  region?: string;
  quoteType?: string;
  typeDisp?: string;
  quoteSourceName?: string;
  triggerable?: boolean;
  customPriceAlertConfidence?: string;
  currency?: string;
  marketState?: string;
  epsTrailingTwelveMonths?: number;
  epsForward?: number;
  epsCurrentYear?: number;
  priceEpsCurrentYear?: number;
  sharesOutstanding?: number;
  bookValue?: number;
  fiftyDayAverage?: number;
  fiftyDayAverageChange?: number;
  fiftyDayAverageChangePercent?: number;
  twoHundredDayAverage?: number;
  twoHundredDayAverageChange?: number;
  twoHundredDayAverageChangePercent?: number;
  marketCap?: number;
  forwardPE?: number;
  priceToBook?: number;
  sourceInterval?: number;
  exchangeDataDelayedBy?: number;
  averageAnalystRating?: string;
  tradeable?: boolean;
  postMarketPrice?: number;
  postMarketChange?: number;
  exchange?: string;
  shortName?: string;
  longName?: string;
  messageBoardId?: string;
  exchangeTimezoneName?: string;
  exchangeTimezoneShortName?: string;
  gmtOffSetMilliseconds?: number;
  market?: string;
  esgPopulated?: boolean;
  priceHint?: number;
  postMarketChangePercent?: number;
  postMarketTime?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
  regularMarketPrice?: number;
  regularMarketDayHigh?: number;
  regularMarketDayRange?: string;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  regularMarketPreviousClose?: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  fullExchangeName?: string;
  financialCurrency?: string;
  regularMarketOpen?: number;
  averageDailyVolume3Month?: number;
  averageDailyVolume10Day?: number;
  fiftyTwoWeekLowChange?: number;
  fiftyTwoWeekLowChangePercent?: number;
  fiftyTwoWeekRange?: string;
  fiftyTwoWeekHighChange?: number;
  fiftyTwoWeekHighChangePercent?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  dividendDate?: number;
  earningsTimestamp?: number;
  earningsTimestampStart?: number;
  earningsTimestampEnd?: number;
  trailingAnnualDividendRate?: number;
  trailingPE?: number;
  trailingAnnualDividendYield?: number;
  firstTradeDateMilliseconds?: number;
  displayName?: string;
  symbol?: string;
}

export interface MarketStockServer {
  message: string;
  stock: {
    quoteResponse: {
      result: MarketStock[];
      error: string;
    };
  };
}

export interface MarketStockServerObservable {
  stocks?: MarketStock[];
  error?: any
}

export interface MarketStockServerExistsObservable {
  valid: boolean;
}
