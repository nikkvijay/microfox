import PinterestClient from '../src';
import { PinterestError, PinterestErrorCode } from '../src/errors';
import { CreatePinData, UpdateBoardData } from '../src/types';

async function main() {
  // Initialize client
  const pinterest = new PinterestClient({
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!,
  });

  // Set up event listeners
  pinterest.on('request', config => {
    console.log(
      `[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`,
    );
  });

  pinterest.on('response', response => {
    console.log(
      `[${new Date().toISOString()}] ${response.status} ${response.config.url}`,
    );
  });

  pinterest.on('error', error => {
    console.error(`[${new Date().toISOString()}] Error:`, error.message);
  });

  try {
    // Get current user
    const user = await pinterest.getCurrentUser();
    console.log('Current user:', user.username);

    // Create a new board
    const board = await pinterest.createBoard(
      'My Awesome Board',
      'A board for awesome pins',
      'PUBLIC',
    );
    console.log('Created board:', board.id);

    // Update board
    const updatedBoard = await pinterest.updateBoard(board.id, {
      name: 'Updated Board Name',
      privacy: 'PROTECTED',
    });
    console.log('Updated board:', updatedBoard.name);

    // Create a pin with validation
    const pinData: CreatePinData = {
      title: 'My Awesome Pin',
      description: 'This is an awesome pin',
      media_source: {
        source_type: 'image_url',
        url: 'https://example.com/image.jpg',
      },
    };

    const pin = await pinterest.createPin(board.id, pinData);
    console.log('Created pin:', pin.id);

    // Get all pins with pagination
    const allPins = await pinterest.getBoardPins(board.id, {
      page_size: 100,
    });
    console.log('Total pins:', allPins.length);

    // Upload an image
    const imageBuffer = Buffer.from('fake image data');
    const mediaId = await pinterest.uploadPinImage(imageBuffer);
    console.log('Uploaded image:', mediaId);

    // Search pins with pagination
    const searchResults = await pinterest.searchPins('nature', 50);
    console.log('Search results:', searchResults.length);
  } catch (error) {
    if (error instanceof PinterestError) {
      switch (error.code) {
        case PinterestErrorCode.RATE_LIMIT_EXCEEDED:
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case PinterestErrorCode.VALIDATION_ERROR:
          console.error('Validation error:', error.message);
          break;
        case PinterestErrorCode.PERMISSION_DENIED:
          console.error('Permission denied. Please check your access token.');
          break;
        default:
          console.error('Pinterest error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Run the example
main().catch(console.error);
