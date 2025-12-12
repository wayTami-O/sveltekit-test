import { error } from '@sveltejs/kit';

export async function load({ params, fetch }: { params: { id: string }; fetch: typeof globalThis.fetch }) {
	const response = await fetch(`/api/posts/${params.id}`);
	
	if (!response.ok) {
		if (response.status === 404) {
			throw error(404, 'Post not found');
		}
		throw error(response.status, 'Failed to load post');
	}
	
	const post = await response.json();
	return { post };
}

