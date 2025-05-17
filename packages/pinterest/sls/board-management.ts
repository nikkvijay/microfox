import PinterestClient from '../src';
import { Board, UpdateBoardData, PaginationOptions } from '../src/types';

/**
 * Creates a new Pinterest board
 * @param client - Pinterest client instance
 * @param name - Name of the board
 * @param description - Description of the board
 * @param privacy - Privacy setting (PUBLIC, PROTECTED, or SECRET)
 * @returns The created board
 */
export const createBoard = async (
  client: PinterestClient,
  name: string,
  description: string,
  privacy: 'PUBLIC' | 'PROTECTED' | 'SECRET',
): Promise<Board> => {
  return client.createBoard(name, description, privacy);
};

/**
 * Gets all boards for a user
 * @param client - Pinterest client instance
 * @param username - Username to get boards for
 * @param options - Pagination options
 * @returns Array of boards
 */
export const getUserBoards = async (
  client: PinterestClient,
  username: string,
  options?: PaginationOptions,
): Promise<Board[]> => {
  return client.getUserBoards(username, options);
};

/**
 * Updates an existing board
 * @param client - Pinterest client instance
 * @param boardId - ID of the board to update
 * @param boardData - Updated board data
 * @returns The updated board
 */
export const updateBoard = async (
  client: PinterestClient,
  boardId: string,
  boardData: UpdateBoardData,
): Promise<Board> => {
  return client.updateBoard(boardId, boardData);
};

/**
 * Deletes a board
 * @param client - Pinterest client instance
 * @param boardId - ID of the board to delete
 */
export const deleteBoard = async (
  client: PinterestClient,
  boardId: string,
): Promise<void> => {
  return client.deleteBoard(boardId);
};

/**
 * Gets a single board by ID
 * @param client - Pinterest client instance
 * @param boardId - ID of the board to get
 * @returns The requested board
 */
export const getBoard = async (
  client: PinterestClient,
  boardId: string,
): Promise<Board> => {
  return client.getBoard(boardId);
}; 