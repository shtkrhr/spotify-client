import { HttpRequest } from '@angular/common/http';

export const isSpotifyApi = (req: HttpRequest<any>) => req.url.indexOf('https://api.spotify.com') === 0;
