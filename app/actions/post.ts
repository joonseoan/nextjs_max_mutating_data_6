'use server';

import { redirect } from "next/navigation";
import { storePost } from "@/lib/posts";

export async function createPost(prevState: { errors: string[] }, formData: FormData) {
  // WE DO NOT NEED TO DIRECT `use server` any more since we specify `use server` up and above.
  // 'use server';

  const title = formData.get('title')?.toString() ?? '';
  const image = formData.get('image') as File;
  const content = formData.get('content')?.toString() ?? '';
  const errors = [];

  if (!title || !title.trim()) {
    errors.push('Title is required.');
  }

  if (!content || !content.trim()) {
    errors.push('Content is required.');
  }

  if (!image || !image.size) {
    errors.push('Image is required.');
  }

  if (errors.length) {
    return { errors };
  }

  storePost({
    imageUrl: '',
    title,
    content,
    userId: 1,
  })

  redirect('/feed');
}
