export abstract class AppError extends Error {

	abstract type(): string;
}