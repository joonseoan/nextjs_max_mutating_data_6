'use client';

import { useActionState } from "react";
import FormSubmit from "./form-submit";
export interface ErrorsProps {
  errors: string[];
}

export interface PostFormProps {
  action: (prevState: ErrorsProps, formData: FormData) => Promise<ErrorsProps>;
}

function PostForm({ action }: PostFormProps) {
  const [state, formAction] = useActionState<ErrorsProps, FormData>(
    action,
    { errors: [] }
  )

  console.log('state: ', state)

  return (
    <form action={formAction}>
    {/* Without framework like NextJS: `form action` */}
    {/* <form action={createPost}> */}
      <p className="form-control">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
      </p>
      <p className="form-control">
        <label htmlFor="image">Image</label>
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
      {state.errors.length !== 0 && <ul className="form-errors">
        {state.errors.map((error) => <li key={error}>{error}</li>)}
      </ul>}
    </form>
  );
}

export default PostForm;