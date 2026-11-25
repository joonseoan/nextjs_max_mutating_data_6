export interface LikeButtonProps {
  // [IMPORTANT!] - typescript
  // Without the argument is also fine because in the typescript rule,
  // fewer arguments function can be covered by more argument function.
  // formAction: () => Promise<void>
  formAction: (formData: FormData) => Promise<void>
}

// Approaching 2 (using form)
export default function LikeButton() {

  // Approaching 1 (using button)
// export default function LikeButton({ formAction }: LikeButtonProps) {
  // [IMPORTANT]!!!
  // Please make sure that `onClick` should not be used in server component!
  return (
    <button
      // Approaching 2
      // no formAction
      // Approaching 1
      // formAction={formAction}
      // Should not be implemented in the server component
      // onClick={() => { }}
      className="like-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
    </button>
  );
}
