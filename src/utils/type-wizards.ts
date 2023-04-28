import { z } from 'zod';

type ZodEnumRecord<
	ZodEnum extends z.ZodEnum<[string, ...string[]]>,
	ValueSchema extends z.ZodTypeAny
> = Record<ZodEnum['options'][number], z.output<ValueSchema>>;
export const exhaustiveEnumRecord = <
	ZodEnum extends z.ZodEnum<[string, ...string[]]>,
	ValueSchema extends z.ZodTypeAny
>(
	zodEnum: ZodEnum,
	valueSchema: ValueSchema,
): z.ZodObject<
	ZodEnumRecord<ZodEnum, ValueSchema>,
	'strip',
	z.ZodTypeAny,
	ZodEnumRecord<ZodEnum, ValueSchema>
> =>
	z.object(
		zodEnum.options.reduce((acc, key) => {
			acc[key as keyof typeof acc] = valueSchema;
			return acc;
		}, {} as ZodEnumRecord<ZodEnum, ValueSchema>),
	);