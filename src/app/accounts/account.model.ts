export interface UserAccount {
  _id: string;
  user?: string;
  name: string;
  balance: number | string;
  currency: string;
  date_start: string;
  date_end: string;
}

export interface UserAccountServer {
  message: string;
  accounts: UserAccount[];
}

export interface UserAccountObservable {
  accountData: UserAccount[];
}
