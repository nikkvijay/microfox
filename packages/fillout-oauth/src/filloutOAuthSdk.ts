import { z } from 'zod';
import { FilloutOAuthConfig, AccessTokenResponse, AuthorizationCodeParams, TokenRequestParams } from './types';
import { filloutOAuthConfigSchema, accessTokenResponseSchema } from './schemas';

export class FilloutOAuthSdk {
  private config: FilloutOAuthConfig;

  constructor(config: FilloutOAuthConfig) {
    this.config = filloutOAuthConfigSchema.parse(config);
  }

  /**
   * Generates the authorization URL for the OAuth flow.
   * @param state An optional state parameter for CSRF protection
   * @returns The authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
    });

    if (state) {
      params.append('state', state);
    }

    return `https://build.fillout.com/authorize/oauth?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param params The parameters required for the token request
   * @returns The access token response
   */
  async getAccessToken(params: AuthorizationCodeParams): Promise<AccessTokenResponse> {
    const tokenParams: TokenRequestParams = {
      code: params.code,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
    };

    const response = await fetch('https://server.fillout.com/public/oauth/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenParams),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return accessTokenResponseSchema.parse(data);
  }

  /**
   * Validates the access token by making a request to the Fillout API.
   * @param accessToken The access token to validate
   * @returns A boolean indicating whether the token is valid
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.fillout.com/v1/api/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating access token:', error);
      return false;
    }
  }
}

export function createFilloutOAuth(config: FilloutOAuthConfig): FilloutOAuthSdk {
  return new FilloutOAuthSdk(config);
}
