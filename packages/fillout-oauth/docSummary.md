# Fillout OAuth 2.0 Implementation Summary for TypeScript

This document summarizes the Fillout OAuth 2.0 flow and provides the technical details necessary to build a TypeScript OAuth package.  The flow described is Authorization Code Grant.  Implicit grant is not explicitly mentioned.

## 1. OAuth 2.0 Flow Details: Authorization Code Grant

The Fillout OAuth 2.0 implementation uses the Authorization Code Grant flow. This involves a two-legged authentication process:

* **Step 1: Authorization Request:** The client redirects the user to the Fillout authorization endpoint.  After authorization, Fillout redirects the user back to the client's redirect URI with an authorization code.
* **Step 2: Token Request:** The client exchanges the authorization code for an access token by making a request to the Fillout token endpoint.
* **Step 3: API Access:** The client uses the access token to access the Fillout API.


## 2. Required Credentials

* **`client_id`:** (String)  A unique identifier for your application, obtained during application creation in Fillout's developer settings.
* **`client_secret`:** (String) A secret key for your application, also obtained during application creation.  **Keep this secret!**  It should never be exposed in client-side code.


## 3. Authorization Endpoint

* **URL:** `https://build.fillout.com/authorize/oauth`
* **Method:** `GET`
* **Parameters:**
    * `client_id`: Your application's `client_id`.
    * `redirect_uri`: The URL where Fillout will redirect the user after authorization.  Must be pre-registered.
    * `state`: (Optional) An arbitrary string to maintain state between the request and callback.  Used to prevent CSRF attacks.


## 4. Token Endpoint

* **URL:** `https://server.fillout.com/public/oauth/accessToken`
* **Method:** `POST`
* **Body Parameters:**
    * `code`: The authorization code received from the authorization endpoint.
    * `client_id`: Your application's `client_id`.
    * `client_secret`: Your application's `client_secret`.
    * `redirect_uri`: The redirect URI used in the authorization request.


## 5. Required Scopes

The documentation does not explicitly list available scopes.  Further clarification is needed from Fillout's documentation to determine if scope parameters are required in the authorization request and what scopes are available.


## 6. Token Response Format

* **Format:** JSON
* **Example:**
```json
{
  "access_token": "abcdefg",
  "base_url": "https://api.fillout.com"
}
```
* **Fields:**
    * `"access_token"`: (String) The access token used to authenticate API requests.
    * `"base_url"`: (String) The base URL for the Fillout API.  May vary based on location or self-hosting.


## 7. Token Refresh Mechanism

The documentation does not describe a token refresh mechanism.  It's unclear whether access tokens have an expiration time and whether refresh tokens are supported.  This needs further clarification from Fillout.


## 8. Other Important Information

* **Error Handling:** The documentation lacks details on error responses from both the authorization and token endpoints.  Robust error handling should be implemented in the TypeScript package.
* **Security:**  Properly secure your `client_secret`.  Never expose it in client-side code.  Use HTTPS for all communication with the Fillout servers.
* **State Parameter:**  Always use the `state` parameter to prevent CSRF attacks.
* **API Documentation:**  The provided documentation only covers the OAuth flow.  You'll need to consult Fillout's API documentation to understand how to use the access token to interact with their API.


## TypeScript Package Considerations

A TypeScript package would need to handle:

* **HTTP requests:** Using `fetch` or a library like `axios`.
* **URL encoding/decoding:** For handling query parameters and form data.
* **Error handling:**  Graceful handling of network errors and OAuth errors.
* **Storage:** Securely storing the access token (e.g., using browser local storage with appropriate security measures).
* **Modular design:** Breaking down the package into smaller, reusable modules (e.g., authorization, token exchange, API interaction).


This summary provides a solid foundation for building a TypeScript OAuth package for the Fillout API.  However, further clarification from Fillout's documentation is needed regarding scopes, token refresh, and error handling.
