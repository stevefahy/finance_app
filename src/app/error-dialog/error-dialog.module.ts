import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorDialogService } from './error-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDialogComponent } from './error-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    BrowserAnimationsModule,
  ],
  declarations: [ErrorDialogComponent],
  exports: [ErrorDialogComponent],
  entryComponents: [ErrorDialogComponent],
  providers: [ErrorDialogService],
})
export class ErrorDialogModule {}
