import PinterestClient from '../src';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

async function main() {
  // Check if access token is available
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('Error: Pinterest access token not found!');
    console.log('\nTo set up your access token:');
    console.log('1. Go to https://developers.pinterest.com/');
    console.log('2. Create an app or use an existing one');
    console.log('3. Get your access token from the app settings');
    console.log('4. Create a .env file in the package root with:');
    console.log('   PINTEREST_ACCESS_TOKEN=your_token_here');
    process.exit(1);
  }

  // Initialize the client with your Pinterest access token
  const pinterest = new PinterestClient({
    accessToken,
  });

  try {
    // Get current user
    console.log('Fetching current user...');
    const user = await pinterest.getCurrentUser();
    console.log('Current user:', user);

    // Create a new board
    console.log('\nCreating a new board...');
    const board = await pinterest.createBoard(
      'Test Board',
      'A board created using the Pinterest SDK',
      'PUBLIC',
    );
    console.log('Created board:', board);

    // Create a new pin
    console.log('\nCreating a new pin...');
    const pin = await pinterest.createPin(board.id, {
      title: 'Test Pin',
      description: 'A pin created using the Pinterest SDK',
      link: 'https://example.com',
      media_source: {
        source_type: 'image_url',
        url: 'https://picsum.photos/800/600', // Using a random image for testing
      },
    });
    console.log('Created pin:', pin);

    // Search for pins
    console.log('\nSearching for pins...');
    const pins = await pinterest.searchPins('nature', 5);
    console.log('Search results:', pins);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
