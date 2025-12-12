import { z } from 'zod';

export const postFormSchema = z.object({
	title: z
		.string()
		.min(1, 'Заголовок обязателен для заполнения')
		.refine((val) => val.trim().length >= 3, 'Заголовок должен содержать минимум 3 символа')
		.max(200, 'Заголовок не должен превышать 200 символов'),
	content: z
		.string()
		.min(1, 'Содержание обязательно для заполнения')
		.refine((val) => val.trim().length >= 10, 'Содержание должно содержать минимум 10 символов'),
	excerpt: z
		.string()
		.max(500, 'Краткое описание не должно превышать 500 символов')
		.optional()
		.or(z.literal('')),
	imageUrl: z.string().optional().or(z.literal(''))
});

export type PostFormData = z.infer<typeof postFormSchema>;

