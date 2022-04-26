import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ERROR_MESSAGES } from '../settings/error_messages';
import { LoadingService } from '../services/loading/loading.service';
import { ErrorDialogService } from '../error-dialog/error-dialog.service';
import { ErrorInterface } from './error.model';
import { ErrorDialogInterface } from '../error-dialog/error-dialog.model';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorListener = new Subject<ErrorInterface>();
  private errorMessages = ERROR_MESSAGES;

  constructor(
    private loadingService: LoadingService,
    private dialogService: ErrorDialogService
  ) {}

  openDialog(msg: string, params: string) {
    const options: ErrorDialogInterface = {
      title: 'Error',
      message: msg,
      params: params,
    };
    this.dialogService.open(options);

    // this.dialogService.confirmed().subscribe((confirmed) => {
    //   if (confirmed) {
    //   }
    // });
  }

  getErrorListener() {
    return this.errorListener.asObservable();
  }

  throwError({ message, params }: ErrorInterface) {
    let error_string = this.errorMessages.find((i) => i.error === message);
    if (error_string) {
      this.loadingService.setLoading('false');
      let params_string: string = params;
      if (params.length > 0) {
        params_string = '\n Cant load:' + params_string;
      }
      if (error_string.action == 'dialog') {
        // Show the error in a dialog
        this.openDialog(error_string.message, params_string);
      } else {
        // Show the errpr in the error component
        this.errorListener.next({
          message: error_string.message,
          params: params,
        });
      }
    }
  }

  clearError() {
    this.errorListener.next({ message: '', params: '' });
  }

  handleError() {
    this.errorListener.next(null);
  }
}
