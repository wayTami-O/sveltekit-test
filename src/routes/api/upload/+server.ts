import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('image') as File;

		if (!file) {
			return error(400, 'No file provided');
		}

		if (!file.type.startsWith('image/')) {
			return error(400, 'File must be an image');
		}

		if (file.size > 5 * 1024 * 1024) {
			return error(400, 'File size must be less than 5MB');
		}

		const uploadsDir = join(process.cwd(), 'static', 'uploads');
		if (!existsSync(uploadsDir)) {
			await mkdir(uploadsDir, { recursive: true });
		}

		const timestamp = Date.now();
		const extension = file.name.split('.').pop();
		const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
		const filepath = join(uploadsDir, filename);

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await writeFile(filepath, buffer);
		const imageUrl = `/uploads/${filename}`;

		return json({ imageUrl });
	} catch (err) {
		console.error('Upload error:', err);
		return error(500, 'Failed to upload image');
	}
};

