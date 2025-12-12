import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { postsApi } from '$entities/post';

export const GET: RequestHandler = async ({ params }) => {
	const post = await postsApi.getById(params.id as string);
	if (!post) {
		return error(404, 'Post not found');
	}
	return json(post);
};

export const PUT: RequestHandler = async ({ params, request }) => {
	const data = await request.json();
	const { title, content, excerpt, imageUrl } = data;

	const updates: Partial<{ title: string; content: string; excerpt: string; imageUrl?: string }> = {
		title,
		content,
		excerpt: excerpt || content?.substring(0, 150) + '...'
	};

	if (imageUrl !== undefined) {
		updates.imageUrl = imageUrl || undefined;
	}

	const post = await postsApi.update(params.id as string, updates);

	if (!post) {
		return error(404, 'Post not found');
	}

	return json(post);
};

export const DELETE: RequestHandler = async ({ params }) => {
	const success = await postsApi.delete(params.id as string);
	if (!success) {
		return error(404, 'Post not found');
	}
	return json({ success: true });
};
