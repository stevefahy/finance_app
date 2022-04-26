export type StockStatus = 'open' | 'closed' | 'archived';
type StockStatusView = 'OPEN' | 'CLOSED' | 'ARCHIVED';

export interface StatusDropDown {
  value: StockStatus;
  viewValue: StockStatusView;
}

export class StockStatusDropDown {
  statuses: StatusDropDown[] = [
    { value: 'open', viewValue: 'OPEN' },
    { value: 'closed', viewValue: 'CLOSED' },
    { value: 'archived', viewValue: 'ARCHIVED' },
  ];
}
