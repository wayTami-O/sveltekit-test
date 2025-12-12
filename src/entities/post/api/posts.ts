import type { BlogPost } from '../model/index.js';
import { getAllPosts, createPost, getPostById, updatePost, deletePost } from '../lib/store.js';

export const postsApi = {
	getAll: async (): Promise<BlogPost[]> => {
		return getAllPosts();
	},

	getById: async (id: string): Promise<BlogPost | null> => {
		const post = getPostById(id);
		return post || null;
	},

	create: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
		return createPost(post);
	},

	update: async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): Promise<BlogPost | null> => {
		return updatePost(id, updates);
	},

	delete: async (id: string): Promise<boolean> => {
		return deletePost(id);
	}
};

