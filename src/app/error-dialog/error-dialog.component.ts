import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogService } from './error-dialog.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      params: string;
    },
    private errorDilaogService: ErrorDialogService
  ) {}

  public close(value) {
    this.errorDilaogService.close();
  }

  @HostListener('keydown.esc')
  public onEsc() {
    this.close(false);
  }
}
