import { UserTax } from '../tax/tax.model';
import { UserAccount } from '../accounts/account.model';
import { UserStock } from '../stocks/stocks.user.model';
import { MarketStockServer } from '../stocks/stocks.market.model';
import { MarketCurrencyServer } from '../services/currency-market/currency.market.model';

// False = live data, true = debug data, polling = true (disable polling)
export const DEBUG = {
  USER: false,
  MARKET: true,
  POLLING: false,
  LOGGING: { log: true, source: false },
};

export const ACCOUNTS: UserAccount[] = [
  {
    _id: '608317738b7ce72538175bf2',
    name: 'deGiro debug',
    balance: 1000,
    currency: 'USD',
    date_start: '2021-04-21T23:00:00.000Z',
    date_end: '2021-04-23T23:00:00.000Z',
  },
  {
    _id: '608317738b7ce72538175bf2',
    name: 'Revolut debug',
    balance: 10000,
    currency: 'EUR',
    date_start: '2021-04-21T23:00:00.000Z',
    date_end: '2021-04-23T23:00:00.000Z',
  },
];

export const TAXS: UserTax[] = [
  {
    _id: '608317738b7ce72538175bf2',
    tax_type: 'CGT debug',
    rate: '33',
    credit: '1024',
    date_start: '2021-04-21T23:00:00.000Z',
    date_end: '2021-04-23T23:00:00.000Z',
  },
  {
    _id: '608317738b7ce72538175bf2',
    tax_type: 'ANOTHER TAX debug',
    rate: '20',
    credit: '2024',
    date_start: '2021-04-21T23:00:00.000Z',
    date_end: '2021-04-23T23:00:00.000Z',
  },
];

export const USER_STOCKS: UserStock[] = [
  {
    ticker: 'aapl',
    price: '1024',
    _id: '608317738b7ce72538175bf2',
    currency: 'USD',
    forex: '0.587',
    amount: '5',
    fee: '1.80',
    dividend_yield: '0',
    status: 'closed',
    date_start: '2021-04-21T23:00:00.000Z',
    date_end: '2021-04-23T23:00:00.000Z',
  },
  {
    ticker: 'googl',
    price: '1024',
    _id: '608317ab8b7ce72538175bf3',
    currency: 'USD',
    forex: '0.587',
    amount: '5',
    fee: '1.80',
    dividend_yield: '0',
    status: 'open',
    date_start: '2021-04-21T23:00:00.000Z',
    date_end: '2021-04-23T23:00:00.000Z',
  },
];

export const MARKET_STOCKS: MarketStockServer = {
  message: 'Stock loaded successfully',
  stock: {
    quoteResponse: {
      result: [
        {
          language: 'en-US',
          region: 'US',
          quoteType: 'EQUITY',
          quoteSourceName: 'Nasdaq Real Time Price',
          triggerable: true,
          currency: 'USD',
          marketState: 'REGULAR',
          regularMarketChange: 1.0149994,
          regularMarketChangePercent: 0.7923492,
          regularMarketTime: 1620318722,
          regularMarketPrice: 129.115,
          regularMarketDayHigh: 129.188,
          regularMarketDayRange: '127.1306 - 129.188',
          regularMarketDayLow: 127.1306,
          regularMarketVolume: 40854636,
          regularMarketPreviousClose: 128.1,
          bid: 128.69,
          ask: 128.67,
          bidSize: 14,
          askSize: 8,
          fullExchangeName: 'NasdaqGS',
          financialCurrency: 'USD',
          regularMarketOpen: 127.89,
          averageDailyVolume3Month: 102151280,
          averageDailyVolume10Day: 99752662,
          fiftyTwoWeekLowChange: 54.062508,
          fiftyTwoWeekLowChangePercent: 0.7203292,
          fiftyTwoWeekRange: '75.0525 - 145.09',
          fiftyTwoWeekHighChange: -15.974991,
          fiftyTwoWeekHighChangePercent: -0.11010401,
          fiftyTwoWeekLow: 75.0525,
          fiftyTwoWeekHigh: 145.09,
          dividendDate: 1620864000,
          earningsTimestamp: 1619627400,
          earningsTimestampStart: 1627469940,
          earningsTimestampEnd: 1627905600,
          trailingAnnualDividendRate: 0.82,
          trailingPE: 29.02113,
          trailingAnnualDividendYield: 0.0064012487,
          epsTrailingTwelveMonths: 4.449,
          epsForward: 5.31,
          epsCurrentYear: 5.16,
          priceEpsCurrentYear: 25.02229,
          sharesOutstanding: 16687599616,
          bookValue: 4.146,
          fiftyDayAverage: 128.37428,
          fiftyDayAverageChange: 0.74072266,
          fiftyDayAverageChangePercent: 0.005770024,
          twoHundredDayAverage: 126.06927,
          twoHundredDayAverageChange: 3.0457382,
          twoHundredDayAverageChangePercent: 0.024159243,
          marketCap: 2154619469824,
          forwardPE: 24.315443,
          priceToBook: 31.142067,
          sourceInterval: 15,
          exchangeDataDelayedBy: 0,
          averageAnalystRating: '2.0 - Buy',
          tradeable: false,
          firstTradeDateMilliseconds: 345479400000,
          priceHint: 2,
          exchange: 'NMS',
          shortName: 'Apple Inc.',
          longName: 'Apple Inc.',
          messageBoardId: 'finmb_24937',
          exchangeTimezoneName: 'America/New_York',
          exchangeTimezoneShortName: 'EDT',
          gmtOffSetMilliseconds: -14400000,
          market: 'us_market',
          esgPopulated: false,
          displayName: 'Apple',
          symbol: 'AAPL',
        },
        {
          language: 'en-US',
          region: 'US',
          quoteType: 'EQUITY',
          quoteSourceName: 'Nasdaq Real Time Price',
          triggerable: true,
          currency: 'USD',
          marketState: 'REGULAR',
          regularMarketChange: 10.439941,
          regularMarketChangePercent: 0.4510142,
          regularMarketTime: 1620318696,
          regularMarketPrice: 2555.43,
          regularMarketDayHigh: 2329.6,
          regularMarketDayRange: '2293.0417 - 2329.6',
          regularMarketDayLow: 2293.0417,
          regularMarketVolume: 494894,
          regularMarketPreviousClose: 2314.77,
          bid: 2318.89,
          ask: 2321.23,
          bidSize: 29,
          askSize: 9,
          fullExchangeName: 'NasdaqGS',
          financialCurrency: 'USD',
          regularMarketOpen: 2306.33,
          averageDailyVolume3Month: 1601724,
          averageDailyVolume10Day: 2145512,
          fiftyTwoWeekLowChange: 1001.9099,
          fiftyTwoWeekLowChangePercent: 0.7571298,
          fiftyTwoWeekRange: '1323.3 - 2431.38',
          fiftyTwoWeekHighChange: -106.16992,
          fiftyTwoWeekHighChangePercent: -0.04366653,
          fiftyTwoWeekLow: 1323.3,
          fiftyTwoWeekHigh: 2431.38,
          earningsTimestamp: 1619553600,
          earningsTimestampStart: 1627502400,
          earningsTimestampEnd: 1627934400,
          trailingPE: 30.986273,
          epsTrailingTwelveMonths: 75.04,
          epsForward: 95.09,
          epsCurrentYear: 88.21,
          priceEpsCurrentYear: 26.359936,
          sharesOutstanding: 300747008,
          bookValue: 342.743,
          fiftyDayAverage: 2204.131,
          fiftyDayAverageChange: 121.07886,
          fiftyDayAverageChangePercent: 0.054932695,
          twoHundredDayAverage: 1931.6243,
          twoHundredDayAverageChange: 393.5857,
          twoHundredDayAverageChangePercent: 0.20375893,
          marketCap: 1571913990144,
          forwardPE: 24.45273,
          priceToBook: 6.7841206,
          sourceInterval: 15,
          exchangeDataDelayedBy: 0,
          averageAnalystRating: '1.7 - Buy',
          tradeable: false,
          firstTradeDateMilliseconds: 1092922200000,
          priceHint: 2,
          exchange: 'NMS',
          shortName: 'Alphabet Inc.',
          longName: 'Alphabet Inc.',
          messageBoardId: 'finmb_29096',
          exchangeTimezoneName: 'America/New_York',
          exchangeTimezoneShortName: 'EDT',
          gmtOffSetMilliseconds: -14400000,
          market: 'us_market',
          esgPopulated: false,
          symbol: 'GOOGL',
        },
        {
          language: 'en-US',
          region: 'US',
          quoteType: 'EQUITY',
          quoteSourceName: 'Nasdaq Real Time Price',
          triggerable: true,
          currency: 'USD',
          marketState: 'REGULAR',
          regularMarketChange: 10.439941,
          regularMarketChangePercent: 0.4510142,
          regularMarketTime: 1620318696,
          regularMarketPrice: 2555.43,
          regularMarketDayHigh: 2329.6,
          regularMarketDayRange: '2293.0417 - 2329.6',
          regularMarketDayLow: 2293.0417,
          regularMarketVolume: 494894,
          regularMarketPreviousClose: 2314.77,
          bid: 2318.89,
          ask: 2321.23,
          bidSize: 29,
          askSize: 9,
          fullExchangeName: 'NasdaqGS',
          financialCurrency: 'USD',
          regularMarketOpen: 2306.33,
          averageDailyVolume3Month: 1601724,
          averageDailyVolume10Day: 2145512,
          fiftyTwoWeekLowChange: 1001.9099,
          fiftyTwoWeekLowChangePercent: 0.7571298,
          fiftyTwoWeekRange: '1323.3 - 2431.38',
          fiftyTwoWeekHighChange: -106.16992,
          fiftyTwoWeekHighChangePercent: -0.04366653,
          fiftyTwoWeekLow: 1323.3,
          fiftyTwoWeekHigh: 2431.38,
          earningsTimestamp: 1619553600,
          earningsTimestampStart: 1627502400,
          earningsTimestampEnd: 1627934400,
          trailingPE: 30.986273,
          epsTrailingTwelveMonths: 75.04,
          epsForward: 95.09,
          epsCurrentYear: 88.21,
          priceEpsCurrentYear: 26.359936,
          sharesOutstanding: 300747008,
          bookValue: 342.743,
          fiftyDayAverage: 2204.131,
          fiftyDayAverageChange: 121.07886,
          fiftyDayAverageChangePercent: 0.054932695,
          twoHundredDayAverage: 1931.6243,
          twoHundredDayAverageChange: 393.5857,
          twoHundredDayAverageChangePercent: 0.20375893,
          marketCap: 1571913990144,
          forwardPE: 24.45273,
          priceToBook: 6.7841206,
          sourceInterval: 15,
          exchangeDataDelayedBy: 0,
          averageAnalystRating: '1.7 - Buy',
          tradeable: false,
          firstTradeDateMilliseconds: 1092922200000,
          priceHint: 2,
          exchange: 'NMS',
          shortName: 'Alphabet Inc.',
          longName: 'Alphabet Inc.',
          messageBoardId: 'finmb_29096',
          exchangeTimezoneName: 'America/New_York',
          exchangeTimezoneShortName: 'EDT',
          gmtOffSetMilliseconds: -14400000,
          market: 'us_market',
          esgPopulated: false,
          symbol: 'MMM',
        },
        {
          language: 'en-US',
          region: 'US',
          quoteType: 'EQUITY',
          quoteSourceName: 'Nasdaq Real Time Price',
          triggerable: true,
          currency: 'USD',
          exchange: 'NYQ',
          longName: 'Johnson & Johnson',
          messageBoardId: 'finmb_139677',
          exchangeTimezoneName: 'America/New_York',
          exchangeTimezoneShortName: 'EDT',
          gmtOffSetMilliseconds: -14400000,
          market: 'us_market',
          esgPopulated: false,
          shortName: 'Johnson & Johnson',
          firstTradeDateMilliseconds: -252322200000,
          priceHint: 2,
          postMarketChangePercent: -0.703727,
          postMarketTime: 1625774957,
          marketState: 'POST',
          earningsTimestamp: 1626870600,
          earningsTimestampStart: 1626870600,
          earningsTimestampEnd: 1626870600,
          trailingAnnualDividendRate: 4.04,
          trailingPE: 29.87105,
          trailingAnnualDividendYield: 0.02384747,
          epsTrailingTwelveMonths: 5.661,
          epsForward: 10.42,
          epsCurrentYear: 9.52,
          priceEpsCurrentYear: 17.762606,
          sharesOutstanding: 2633400064,
          bookValue: 25.006,
          fiftyDayAverage: 166.28647,
          fiftyDayAverageChange: 2.8135376,
          fiftyDayAverageChangePercent: 0.016919823,
          twoHundredDayAverage: 163.26161,
          twoHundredDayAverageChange: 5.838394,
          twoHundredDayAverageChangePercent: 0.035760973,
          marketCap: 445307977728,
          forwardPE: 16.228407,
          priceToBook: 6.7623773,
          sourceInterval: 15,
          exchangeDataDelayedBy: 0,
          averageAnalystRating: '1.9 - Buy',
          tradeable: false,
          postMarketPrice: 167.91,
          postMarketChange: -1.1900024,
          regularMarketChange: -0.30999756,
          regularMarketChangePercent: -0.18298657,
          regularMarketTime: 1625774402,
          regularMarketPrice: 169.1,
          regularMarketDayHigh: 169.45,
          regularMarketDayRange: '167.58 - 169.45',
          regularMarketDayLow: 167.58,
          regularMarketVolume: 5626309,
          regularMarketPreviousClose: 169.41,
          bid: 168.78,
          ask: 168.75,
          bidSize: 8,
          askSize: 13,
          fullExchangeName: 'NYSE',
          financialCurrency: 'USD',
          regularMarketOpen: 168.7,
          averageDailyVolume3Month: 7074500,
          averageDailyVolume10Day: 6182471,
          fiftyTwoWeekLowChange: 35.450012,
          fiftyTwoWeekLowChangePercent: 0.26524514,
          fiftyTwoWeekRange: '133.65 - 173.65',
          fiftyTwoWeekHighChange: -4.549988,
          fiftyTwoWeekHighChangePercent: -0.026202062,
          fiftyTwoWeekLow: 133.65,
          fiftyTwoWeekHigh: 173.65,
          dividendDate: 1623110400,
          symbol: 'JNJ',
        },
        {
          language: 'en-US',
          region: 'US',
          quoteType: 'EQUITY',
          typeDisp: 'Equity',
          quoteSourceName: 'Delayed Quote',
          triggerable: false,
          customPriceAlertConfidence: 'LOW',
          currency: 'GBp',
          exchange: 'LSE',
          shortName: 'SHELL PLC ORD EUR0.07',
          longName: 'Shell plc',
          messageBoardId: 'finmb_22385966',
          exchangeTimezoneName: 'Europe/London',
          exchangeTimezoneShortName: 'BST',
          gmtOffSetMilliseconds: 3600000,
          market: 'gb_market',
          esgPopulated: false,
          marketState: 'POST',
          firstTradeDateMilliseconds: 1121410800000,
          priceHint: 2,
          regularMarketChange: 35,
          regularMarketChangePercent: 1.6393442,
          regularMarketTime: 1649776755,
          regularMarketPrice: 2170,
          regularMarketDayHigh: 2176.5,
          regularMarketDayRange: '2120.0 - 2176.5',
          regularMarketDayLow: 2120,
          regularMarketVolume: 11269721,
          regularMarketPreviousClose: 2135,
          bid: 2172,
          ask: 2172.5,
          fullExchangeName: 'LSE',
          financialCurrency: 'USD',
          regularMarketOpen: 2132.5,
          averageDailyVolume3Month: 27164040,
          averageDailyVolume10Day: 26290403,
          fiftyTwoWeekLowChange: 887.22,
          fiftyTwoWeekLowChangePercent: 0.6916384,
          fiftyTwoWeekRange: '1282.78 - 2176.5',
          fiftyTwoWeekHighChange: -6.5,
          fiftyTwoWeekHighChangePercent: -0.002986446,
          fiftyTwoWeekLow: 1282.78,
          fiftyTwoWeekHigh: 2176.5,
          earningsTimestamp: 1651716000,
          earningsTimestampStart: 1651716000,
          earningsTimestampEnd: 1651716000,
          trailingAnnualDividendRate: 0.893,
          trailingPE: 11.004057,
          trailingAnnualDividendYield: 0.00041826698,
          epsTrailingTwelveMonths: 197.2,
          epsForward: 3.17,
          epsCurrentYear: 3.29,
          priceEpsCurrentYear: 659.57446,
          sharesOutstanding: 7544880128,
          bookValue: 22.464,
          fiftyDayAverage: 2011.896,
          fiftyDayAverageChange: 158.104,
          fiftyDayAverageChangePercent: 0.07858458,
          twoHundredDayAverage: 1700.402,
          twoHundredDayAverageChange: 469.59802,
          twoHundredDayAverageChangePercent: 0.27616882,
          marketCap: 163723902976,
          forwardPE: 6.8454256,
          priceToBook: 96.599,
          sourceInterval: 15,
          exchangeDataDelayedBy: 15,
          averageAnalystRating: '1.9 - Buy',
          tradeable: false,
          symbol: 'SHEL.L',
        },
      ],
      error: null,
    },
  },
};

export const MARKET_CURRENCY: Array<MarketCurrencyServer> = [
  {
    message: 'Currency loaded successfully',
    currency: {
      'Realtime Currency Exchange Rate': {
        '1. From_Currency Code': 'EUR',
        '2. From_Currency Name': 'Euro',
        '3. To_Currency Code': 'USD',
        '4. To_Currency Name': 'United States Dollar',
        '5. Exchange Rate': '1.21080000',
        '6. Last Refreshed': '2021-05-07 12:12:44',
        '7. Time Zone': 'UTC',
        '8. Bid Price': '1.20578000',
        '9. Ask Price': '1.20585000',
      },
    },
  },
  {
    message: 'Currency loaded successfully',
    currency: {
      'Realtime Currency Exchange Rate': {
        '1. From_Currency Code': 'EUR',
        '2. From_Currency Name': 'Euro',
        '3. To_Currency Code': 'GBP',
        '4. To_Currency Name': 'British Pound Sterling',
        '5. Exchange Rate': '0.86801000',
        '6. Last Refreshed': '2021-05-07 12:12:45',
        '7. Time Zone': 'UTC',
        '8. Bid Price': '0.86797400',
        '9. Ask Price': '0.86801900',
      },
    },
  },
];
