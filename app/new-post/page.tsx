// Only for `form action`
// 'use client';

// import FormSubmit from "@/components/form-submit";
import PostForm from "@/components/post-from";
// import { storePost } from "@/lib/posts";
// import { redirect } from "next/navigation";
// import { useActionState } from "react";
import { createPost } from "../actions/post";

// Server action!
export default function NewPostPage() {
  // Moving the code to `actions` folder for the better structure.

  // Depending on the form's action property setup,
  // the arguments of the action function changes.
  // [IMPORTANT]
  // <form action={createPost}>
  // async function createPost(formData: FormData) {

  // [IMPORTANT]
  // <form action={formAction}></form>
  // async function createPost(prevState: { errors: string[] }, formData: FormData) {
  //   // [IMPORTANT]
  //   // converting `form action` to `server action`
  //   // Must not use `use client` in the up ahead.

  //   // creating `server action`
  //   // It must implement `async`.
  //   'use server';

  //   console.log('prevState: ', prevState)


  //   // [IMPORTANT - `form action`]
  //   // React base without any framework like NextJS
  //   // It should be implemented in the pure React or `use client` component
  //   // It does not need to use `async`
  //   const title = formData.get('title')?.toString() ?? '';
  //   const image = formData.get('image') as File;
  //   const content = formData.get('content')?.toString() ?? '';
  //   // console.log('title: ', title);

  //   const errors = [];

  //   if (!title || !title.trim()) {
  //     errors.push('Title is required.');
  //   }

  //   if (!content || !content.trim()) {
  //     errors.push('Content is required.');
  //   }

  //   if (!image || !image.size) {
  //     errors.push('Image is required.');
  //   }

  //   if (errors.length) {
  //     // Then what? after the function returns this data?
  //     // We can't update the UI based on this value in `use server` component.
  //     return { errors };
  //   }

  //   // `never` typescript type for this case instead of Promise<{errors: string[]}>
  //   // `never` can apply for any type!
  //   storePost({
  //     imageUrl: '',
  //     title,
  //     content,
  //     userId: 1,
  //   })

  //   // We can use this one for action after storing data.
  //   // redirect from  `nextjs/navigation` (It is used in the `use server`)
  //   redirect('/feed');

  // }

  // For validation
  // To update the form-related UI we are showing to the user based on some state
  // that maybe changed upon the submission of a form, which is a complex way of
  // saying we can use this hook to output any data we can return from our `form action`.
  // `createPost`: updated `form action`
  // '{ errors: [] }': initial value. For instance, { errors } that is returned by  `createPost`
  // when the `form action` identify issues.
  // const [state, formAction] = useActionState<{ errors: string[] }, FormData>(
  //   createPost,
  //   { errors: [] },
  // );


  return (
    <>
      <h1>Create a new post</h1>
      {/*
        Since `useActionState` should be implemented for the form validation.
        `useActionState` can be implemented only in the client side component.
      */}
      <PostForm action={createPost} />
    
      {/* [IMPORTANT] since it has `useActionState` */}
      {/* <form action={formAction}>
      Without framework like NextJS: `form action`
      In this case, createPost's first arg is `formData`
      <form action={createPost}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
        </p>
        <p className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows={5} />
        </p>
        <p className="form-actions">
          <FormSubmit />
        </p>
      </form> */}
    </>
  );
}
