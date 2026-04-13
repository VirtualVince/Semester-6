import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { LOGIN, SIGNUP } from '../graphql/operations';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  constructor(private apollo: Apollo, private router: Router) {
    this.token = localStorage.getItem('auth_token');
  }

  login(username: string, password: string) {
    return this.apollo.mutate({
      mutation: LOGIN,
      variables: { username, password },
    });
  }

  signup(username: string, email: string, password: string) {
    return this.apollo.mutate({
      mutation: SIGNUP,
      variables: { username, email, password },
    });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    this.apollo.client.clearStore();
    this.router.navigate(['/login']);
  }
}
