import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AndroidService } from '../../android/android.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authStatusSub: Subscription;
  public email: string = 'test@test.com';
  public password: string = '123456';

  // inject AndroidService so that Android Life Cycle hooks are caught

  constructor(
    public authService: AuthService,
    private errorService: ErrorService,
    private androidService: AndroidService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // Do not show loading animation on the login screen
    this.loadingService.setLoading('ignore');

    // Logout in case already logged in (back button to this screen)
    this.authService.logout();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.errorService.clearError();
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
