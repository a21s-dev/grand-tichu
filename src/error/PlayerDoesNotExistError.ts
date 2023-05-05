import { AppError } from './AppError.ts';

export class PlayerDoesNotExistError extends AppError {
	static readonly TYPE = 'PlayerDoesNotExistError';

	type(): string {
		return PlayerDoesNotExistError.TYPE;
	}
}