'use client';

import { useFormStatus } from "react-dom";

function FormSubmit() {
  // Give us different information about the form status
  const status = useFormStatus();

  if (status.pending) {
    return <span>Create post...</span>
  }

  return <>
    <button type="reset">Reset</button>
    <button>Create Post</button>
  </>
}

export default FormSubmit;