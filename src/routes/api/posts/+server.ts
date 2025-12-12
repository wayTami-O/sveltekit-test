import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { postsApi } from '$entities/post';

export const GET: RequestHandler = async () => {
	const posts = await postsApi.getAll();
	return json(posts);
};

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { title, content, excerpt, imageUrl } = data;

	if (!title || !content) {
		return json({ error: 'Title and content are required' }, { status: 400 });
	}

	const post = await postsApi.create({
		title,
		content,
		excerpt: excerpt || content.substring(0, 150) + '...',
		imageUrl: imageUrl || undefined
	});

	return json(post, { status: 201 });
};
