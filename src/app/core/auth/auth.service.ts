import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

const ACCESS_TOKEN_KEY = 'access-token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  authEndpoint() {
    const params = {
      client_id: env.clientId,
      response_type: 'token',
      redirect_uri: `${location.origin}/auth/callback/`,
    };

    const paramsString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    return `https://accounts.spotify.com/authorize?${paramsString}`;
  }

  saveToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

}
