import { AppError } from './AppError.ts';

export class InvalidPlayerNameError extends AppError{
	static readonly TYPE = 'InvalidPlayerNameError';

	type(): string {
		return InvalidPlayerNameError.TYPE;
	}
}