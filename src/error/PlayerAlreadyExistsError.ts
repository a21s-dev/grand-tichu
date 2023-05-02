import { AppError } from './AppError.ts';

export class PlayerAlreadyExistsError extends AppError {
	static readonly TYPE = 'PlayerAlreadyExistsError';

	type(): string {
		return PlayerAlreadyExistsError.TYPE;
	}
}