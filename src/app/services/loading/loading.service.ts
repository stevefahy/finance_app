import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LogService } from 'src/app/settings/logging.service';
import { Loading } from './loading.model';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingStatusListener: BehaviorSubject<Loading> = new BehaviorSubject(
    'false'
  );

  constructor(private logger: LogService) {}

  setLoading(foo: Loading) {
    this.loadingStatusListener.next(foo);
    this.logger.log('Loading', foo);
  }

  getLoadingStatusListener(): Observable<Loading> {
    return this.loadingStatusListener.asObservable();
  }
}
