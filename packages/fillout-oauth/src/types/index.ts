import { z } from 'zod';

export interface FilloutOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AccessTokenResponse {
  access_token: string;
  base_url: string;
}

export interface AuthorizationCodeParams {
  code: string;
}

export interface TokenRequestParams {
  code: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}
