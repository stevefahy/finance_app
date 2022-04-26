import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AndroidService } from '../../android/android.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authStatusSub: Subscription;

  // inject AndroidService so that Android Life Cycle hooks are caught

  constructor(
    public authService: AuthService,
    private loadingService: LoadingService,
    private androidService: AndroidService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    // Do not show loading animation on the login screen
    this.loadingService.setLoading('ignore');

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.errorService.clearError();
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
