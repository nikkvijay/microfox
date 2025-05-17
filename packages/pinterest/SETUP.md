# Pinterest SDK Setup Guide

## Getting Your Pinterest Access Token

1. **Create a Pinterest Developer Account**

   - Go to [Pinterest Developer Portal](https://developers.pinterest.com/)
   - Sign in with your Pinterest account
   - Click "Create App" or use an existing app

2. **Configure Your App**

   - Fill in the required app information:
     - App name
     - App description
     - Website URL
     - Privacy policy URL
   - Select the scopes you need:
     - `boards:read`
     - `boards:write`
     - `pins:read`
     - `pins:write`
     - `user_accounts:read`

3. **Get Your Access Token**
   - In your app dashboard, go to "Credentials"
   - You'll find your:
     - App ID
     - App Secret
   - Click "Generate Access Token"
   - Select the required scopes
   - Copy the generated token

## Setting Up Environment Variables

### Method 1: Using .env file (Recommended)

1. Create a `.env` file in the package root:

   ```bash
   # microfox/packages/pinterest/.env
   PINTEREST_ACCESS_TOKEN=your_access_token_here
   ```

2. Make sure `.env` is in your `.gitignore` file to keep your token secure

### Method 2: Using System Environment Variables

#### Windows (PowerShell)

```powershell
$env:PINTEREST_ACCESS_TOKEN="your_access_token_here"
```

#### Windows (Command Prompt)

```cmd
set PINTEREST_ACCESS_TOKEN=your_access_token_here
```

#### Linux/macOS

```bash
export PINTEREST_ACCESS_TOKEN=your_access_token_here
```

## Testing Your Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the example:
   ```bash
   npx ts-node examples/basic-usage.ts
   ```

If everything is set up correctly, you should see:

- Your user information
- A new board being created
- A new pin being created
- Search results for "nature"

## Troubleshooting

1. **Invalid Token Error**

   - Make sure you've copied the entire token
   - Check if the token has expired
   - Verify the token has the required scopes

2. **Environment Variable Not Found**

   - Confirm the `.env` file exists in the correct location
   - Check if the variable name matches exactly
   - Try restarting your terminal/IDE

3. **API Rate Limits**
   - Pinterest has rate limits on API calls
   - If you hit limits, wait a few minutes before trying again

## Security Notes

- Never commit your access token to version control
- Keep your `.env` file secure
- Regularly rotate your access tokens
- Use the minimum required scopes for your application
