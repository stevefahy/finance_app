export interface UserTax {
  _id: string;
  user?: string;
  tax_type: string;
  rate: string;
  credit: string;
  date_start: string;
  date_end: string;
}

export interface UserTaxObservable {
  taxData: UserTax[];
}

export interface UserTaxServer {
  message: string;
  taxs: UserTax[];
}
