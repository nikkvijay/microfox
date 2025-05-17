import PinterestClient from '../src';
import { CreatePinData, Pin, PaginationOptions } from '../src/types';

/**
 * Creates a new pin on a Pinterest board
 * @param client - Pinterest client instance
 * @param boardId - ID of the board to create pin on
 * @param pinData - Data for the new pin
 * @returns The created pin
 */
export const createPin = async (
  client: PinterestClient,
  boardId: string,
  pinData: CreatePinData,
): Promise<Pin> => {
  return client.createPin(boardId, pinData);
};

/**
 * Gets all pins from a board with pagination
 * @param client - Pinterest client instance
 * @param boardId - ID of the board to get pins from
 * @param options - Pagination options
 * @returns Array of pins
 */
export const getBoardPins = async (
  client: PinterestClient,
  boardId: string,
  options?: PaginationOptions,
): Promise<Pin[]> => {
  return client.getBoardPins(boardId, options);
};

/**
 * Deletes a pin from Pinterest
 * @param client - Pinterest client instance
 * @param pinId - ID of the pin to delete
 */
export const deletePin = async (
  client: PinterestClient,
  pinId: string,
): Promise<void> => {
  return client.deletePin(pinId);
};

/**
 * Updates an existing pin
 * @param client - Pinterest client instance
 * @param pinId - ID of the pin to update
 * @param pinData - Updated pin data
 * @returns The updated pin
 */
export const updatePin = async (
  client: PinterestClient,
  pinId: string,
  pinData: Partial<CreatePinData>,
): Promise<Pin> => {
  return client.updatePin(pinId, pinData);
};

/**
 * Gets a single pin by ID
 * @param client - Pinterest client instance
 * @param pinId - ID of the pin to get
 * @returns The requested pin
 */
export const getPin = async (
  client: PinterestClient,
  pinId: string,
): Promise<Pin> => {
  return client.getPin(pinId);
}; 