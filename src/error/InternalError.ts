import { AppError } from './AppError.ts';

export class InternalError extends AppError {
	static readonly TYPE = 'InternalError';

	type(): string {
		return InternalError.TYPE;
	}
}