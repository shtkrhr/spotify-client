import { environment as env } from '../../../environments/environment';

const ACCESS_TOKEN_KEY = 'access-token';

export const authEndpoint = () => {
  const params = {
    client_id: env.clientId,
    response_type: 'token',
    redirect_uri: `${location.origin}/auth/callback/`,
  };

  const paramsString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `https://accounts.spotify.com/authorize?${paramsString}`;
};

export const saveAccessToken = (accessToken: string) => localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

