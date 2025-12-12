export async function deletePost(id: string): Promise<void> {
	const response = await fetch(`/api/posts/${id}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error('Failed to delete post');
	}
}

