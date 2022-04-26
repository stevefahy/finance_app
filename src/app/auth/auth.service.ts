import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthData, AuthUser, User, AuthUserCreate } from './auth-data.model';

const BACKEND_URL: string = environment.apiUrl + '/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated: boolean = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private conversation: string;
  private authStatusListener: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getConversation(): string {
    return this.conversation;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string): void {
    const authData: AuthData = { email: email, password: password };
    this.http.post<User>(BACKEND_URL + '/signup', authData).subscribe(
      (response) => {
        this.login(email, password);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string): void {
    const authData: AuthData = { email: email, password: password };
    this.http.post<AuthUser>(BACKEND_URL + '/login', authData).subscribe(
      (response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.conversation = response.conversation;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration);
          this.saveAuthData(
            token,
            expirationDate,
            this.userId,
            this.conversation
          );
          this.router.navigate(['']);
        }
      },
      (error) => {
        this.authStatusListener.next(false);
        return error;
      }
    );
  }

  autoAuthUser(): void {
    const authInformation: AuthUserCreate = this.getAuthData();
    if (!authInformation) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn);
      this.conversation = authInformation.conversation;
      this.authStatusListener.next(true);
    } else {
      this.logout();
    }
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  private setAuthTimer(duration: number): void {
    // Clear the timer before starting it
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    conversation: string
  ): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('conversation', conversation);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData(): AuthUserCreate {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const conversation = localStorage.getItem('conversation');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      conversation: conversation,
    };
  }
}
