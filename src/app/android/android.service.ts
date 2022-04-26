import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LogService } from './../settings/logging.service';

// Javascript Interface for Android
interface JavaScriptInterface {
  passParameters(
    fldMerchCode: string,
    fldMerchRefNbr: string,
    fldTxnAmt: string,
    fldTxnScAmt: string,
    fldDatTimeTxn: string,
    fldDate1: string,
    fldDate2: string
  ): void;
}

interface WebAppInterface {
  showToast(toast: string): any;
}

interface android {
  message: string;
  onPause: boolean;
  onStart: boolean;
  onResume: boolean;
  onRestart: boolean;
  onStop: boolean;
}

declare var Android: WebAppInterface;

@Injectable({ providedIn: 'root' })
export class AndroidService {
  private init = {
    response: '',
    file: '',
    file_name: '',
    file_directory: '',
    base64: '',
  };

  public onPause: Subject<Boolean> = new Subject<Boolean>();
  public onStart: Subject<Boolean> = new Subject<Boolean>();
  public onResume: Subject<Boolean> = new Subject<Boolean>();
  public onRestart: Subject<Boolean> = new Subject<Boolean>();
  public onStop: Subject<Boolean> = new Subject<Boolean>();

  constructor(private logger: LogService) {
    window['onPause'] = this.androidOnPause.bind(this);
    window['onStart'] = this.androidOnStart.bind(this);
    window['onResume'] = this.androidOnResume.bind(this);
    window['onRestart'] = this.androidOnRestart.bind(this);
    window['onStop'] = this.androidOnStop.bind(this);
  }

  private androidOnStart(): void {
    this.logger.log('androidOnStart');
    this.onStart.next(true);
  }

  private androidOnResume(): void {
    this.logger.log('androidOnResume');
    this.onResume.next(true);
  }

  private androidOnRestart(): void {
    this.logger.log('androidOnRestart');
    this.onRestart.next(true);
  }

  private androidOnStop(): void {
    this.logger.log('androidOnStop');
    this.onStart.next(true);
  }

  private androidOnPause(): void {
    this.logger.log('androidOnPause');
    this.onPause.next(true);
  }
}
