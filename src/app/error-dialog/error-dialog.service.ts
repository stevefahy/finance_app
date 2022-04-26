import { Injectable, NgZone, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ErrorDialogComponent } from './error-dialog.component';

@Injectable()
export class ErrorDialogService {
  @Output() onChange = new EventEmitter();
  constructor(private dialog: MatDialog, public ngZone: NgZone) {}
  dialogRef: MatDialogRef<ErrorDialogComponent>;

  public close() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }

  public open(options) {
    if (this.dialogRef) {
      this.close();
    }
    this.ngZone.run(() => {
      this.dialogRef = this.dialog.open(ErrorDialogComponent, {
        data: {
          title: options.title,
          message: options.message,
          params: options.params,
        },
      });
    });
  }

  // public confirmed(): Observable<any> {
  //   return this.dialogRef.afterClosed().pipe(
  //     take(1),
  //     map((res) => {
  //       return res;
  //     })
  //   );
  // }
}
