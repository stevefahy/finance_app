import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animation';
import { Subscription } from 'rxjs';
import { LoadingService } from './services/loading/loading.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInAnimation,
    trigger('fadeLoader', [
      transition('* => void', [animate(400, style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  public isLoading = false;
  private loadingStatusSub: Subscription;

  ngOnInit(): void {
    let authorsised = this.authService.getIsAuth();
    if (!authorsised) {
      this.authService.autoAuthUser();
    }
    this.loadingStatusSub = this.loadingService
      .getLoadingStatusListener()
      .subscribe((loadingStatus) => {
        if (loadingStatus == 'true') {
          this.isLoading = true;
        } else if (loadingStatus == 'ignore') {
          this.isLoading = false;
        } else {
          // Delay before removing the loading screen
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
    );
  }
}
