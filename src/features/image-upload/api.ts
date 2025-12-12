export async function uploadImage(file: File): Promise<string> {
	const formData = new FormData();
	formData.append('image', file);

	const response = await fetch('/api/upload', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to upload image');
	}

	const data = await response.json();
	return data.imageUrl;
}

