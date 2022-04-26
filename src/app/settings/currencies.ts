export interface CurrencyDefault {
  id: string;
  name: string;
  symbol: string;
}

export const CURRENCIES: CurrencyDefault[] = [
  { id: 'EUR', name: 'EUR', symbol: '€' },
  { id: 'USD', name: 'USD', symbol: '$' },
  { id: 'GBP', name: 'GBP', symbol: '£' },
];
