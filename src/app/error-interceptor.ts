import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, ErrorHandler } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ErrorService } from './error/error.service';

class ErrorMessage {
  constructor(private errorService: ErrorService) {}
  build(error) {
    let errorMessage = 'An unknown error occurred';
    let errorParams = '';
    if (error.error.message) {
      errorMessage = error.error.message;
    }
    if (error.error.params) {
      errorParams = error.error.params;
    }

    this.errorService.throwError({
      message: errorMessage,
      params: errorParams,
    });
  }
}

@Injectable()
export class GlobalErrorHandlerService
  extends ErrorMessage
  implements ErrorHandler
{
  constructor(errorService: ErrorService) {
    super(errorService);
  }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.build(error);
    }
  }
}

@Injectable()
export class ErrorInterceptor extends ErrorMessage implements HttpInterceptor {
  constructor(errorService: ErrorService) {
    super(errorService);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.build(error);
        return throwError(error);
      })
    );
  }
}
