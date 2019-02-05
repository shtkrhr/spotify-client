import { environment as env } from '../../../environments/environment';
import { Subject } from 'rxjs';

const ACCESS_TOKEN_KEY = 'access-token';

export const authEndpoint = () => {
  const params = {
    client_id: env.clientId,
    response_type: 'token',
    redirect_uri: `${location.origin}/auth/callback/`,
    scope: 'user-follow-read',
  };

  const paramsString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `https://accounts.spotify.com/authorize?${paramsString}`;
};

export const saveAccessToken = (accessToken: string) => localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const logOutEvent$ = new Subject();

export const onLogOut = () => logOutEvent$.asObservable();

const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const logOut = () => {
  clearAccessToken();
  logOutEvent$.next();
};
