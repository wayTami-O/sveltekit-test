import type { BlogPost } from '../types/blog.js';
import postsData from './posts.json';

let posts: BlogPost[] = [...postsData];

export function getAllPosts(): BlogPost[] {
	return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getPostById(id: string): BlogPost | undefined {
	return posts.find((post) => post.id === id);
}

export function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
	const newPost: BlogPost = {
		...post,
		id: Date.now().toString(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	posts.push(newPost);
	return newPost;
}

export function updatePost(id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): BlogPost | null {
	const index = posts.findIndex((post) => post.id === id);
	if (index === -1) return null;

	posts[index] = {
		...posts[index],
		...updates,
		updatedAt: new Date().toISOString()
	};
	return posts[index];
}

export function deletePost(id: string): boolean {
	const index = posts.findIndex((post) => post.id === id);
	if (index === -1) return false;
	posts.splice(index, 1);
	return true;
}

