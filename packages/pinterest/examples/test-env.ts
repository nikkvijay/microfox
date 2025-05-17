import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

function checkEnvironment() {
  console.log('Checking environment variables...\n');

  // Check Pinterest Access Token
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('❌ PINTEREST_ACCESS_TOKEN is not set!');
    console.log('\nTo set it up:');
    console.log('1. Go to https://developers.pinterest.com/');
    console.log('2. Create an app or use an existing one');
    console.log('3. Get your access token from the app settings');
    console.log('4. Set the environment variable using one of these methods:');
    console.log('\n   PowerShell:');
    console.log('   $env:PINTEREST_ACCESS_TOKEN="your_token_here"');
    console.log('\n   Command Prompt:');
    console.log('   set PINTEREST_ACCESS_TOKEN=your_token_here');
    console.log('\n   Or create a .env file with:');
    console.log('   PINTEREST_ACCESS_TOKEN=your_token_here');
  } else {
    console.log('✅ PINTEREST_ACCESS_TOKEN is set');
    console.log('   Token starts with:', accessToken.substring(0, 10) + '...');
  }

  // Check API Version
  const apiVersion = process.env.PINTEREST_API_VERSION;
  console.log('\nAPI Version:', apiVersion || 'Using default (v5)');

  // Check Base URL
  const baseUrl = process.env.PINTEREST_BASE_URL;
  console.log(
    'Base URL:',
    baseUrl || 'Using default (https://api.pinterest.com)',
  );

  console.log('\nEnvironment check complete!');
}

checkEnvironment();
