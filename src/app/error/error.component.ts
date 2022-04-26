import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorInterface } from './error.model';
import { ErrorService } from './error.service';

@Component({
  templateUrl: './error.component.html',
  selector: 'app-error',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit, OnDestroy {
  private errorSub: Subscription;
  public data: ErrorInterface;

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    this.errorSub = this.errorService
      .getErrorListener()
      .subscribe((message) => {
        let params: string = message.params;
        if (message.params.length > 0) {
          params = '\n Cant load:' + message.params;
        }
        this.data = { message: message.message, params: params };
      });
  }

  onHandleError() {
    this.errorService.handleError();
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
