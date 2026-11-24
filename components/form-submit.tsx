'use client';

import { useFormStatus } from "react-dom";

function FormSubmit() {
  // Give us different information about the form status
  const status = useFormStatus();

  if (status.pending) {
    return <p>Create post...</p>
  }

  return <>
    <button type="reset">Reset</button>
    <button>Create Post</button>
  </>
}

export default FormSubmit;