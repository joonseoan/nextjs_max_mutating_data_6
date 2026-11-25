'use client';

import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import { PostProps } from '@/lib/posts';
import { togglePostLikeStatus } from "@/app/actions/post";
import { useOptimistic } from 'react';

export interface PostActionProps {
  post: PostProps
  formAction: (postId: number) => Promise<void>;
}

function Post({ post, formAction }: PostActionProps ) {
  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt as unknown as Date)}
              </time>
            </p>
          </div>
          <div>
            {/* Approaching 2 (using form) */}
            <form
              // With `useOptimistic`
              action={formAction.bind(null, post.id)}
              // Without `useOptimistic`
              // action={togglePostLikeStatus.bind(null, post.id)}
              className={post.isLiked ? 'liked' : ''}
            >
              <LikeButton />
            </form>
            {/* Approaching 1 (using button) */}
            {/*
              // 1)
              [IMPORTANT] must use bind for `formAction` in button
              when we need parameters!
            */}
            {/* null is because it is not for a new object */}
            {/* <LikeButton
              formAction={togglePostLikeStatus.bind(null, post.id)}
            /> */}
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

/*
[IMPORTANT]
`useOptimistic` is a React Hook that lets you show a temporary "optimistic" state
while an async action (like a server request) is still running.
It makes the UI feel instant by immediately showing the expected result,
then automatically falling back to the real server state once the request finishes
(or reverting if it fails).


It depends entirely on what you are comparing it to.
Here is the honest breakdown:

✅ When useOptimistic is the better choice:

    High-frequency, predictable actions: Likes, bookmarks, or toggles.
    The outcome is almost certainly going to succeed, and waiting 300ms
    for a spinner feels sluggish .

    You want less boilerplate: You no longer have to manually
    write try/catch blocks to revert the UI if the server fails.
    React handles the rollback for you .

    You are using Server Actions: It pairs perfectly with React 19's form actions
    and server mutations.

❌ When it is NOT better (or you should avoid it):

    Financial or critical actions: Never use it for payments or anything
    where showing a false "Success" state (even for a moment) would be dangerous .

    You need to show validation errors: If the server might reject the input
    (e.g., a username is taken), don't use it. Wait for the real response
    so you can show the error message properly .

    You are heavily invested in React Query / SWR: useOptimistic is designed
    for React's native state and Server Actions. It can clash with the cache management
    of libraries like React Query, which have their own robust optimistic update systems .
*/

export default function Posts({ posts }: { posts: PostProps[]}) {
  // INPUTS:
  // target data --> `posts`
  // function --> a function that returns the manipulated value in the client side
  // until the server returns the real value

  // OUTPUTS:
  // updated data --> `optimisticPosts`
  // trigger for input function above --> `updatedOptimisticPosts`
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts: PostProps[], updatedPostId: number) => {
    // `updatedPostId` is from the the Post component!!
    const updatedPostIndex = prevPosts.findIndex((post) => post.id === updatedPostId);

    if (updatedPostIndex === -1) {
      return prevPosts;
      // throw new Error('Unable to find the updated index for the like icon.');
    }

    const updatedPost = { ...prevPosts[updatedPostIndex] };
    updatedPost.likes = updatedPost.likes + (updatedPost.likes ? -1 : 1);
    updatedPost.isLiked = updatedPost.isLiked ? 0 : 1;

    const newPosts = [...prevPosts];
    newPosts[updatedPostIndex] = updatedPost;

    return newPosts;
  });

  // async is a function the server side component
  async function updatePost(postId: number) {
    updateOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  }

  // With `useOptimistic`
  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} formAction={updatePost} />
        </li>
      ))}
    </ul>
  );


  // It works but slow.
  // if (!posts || posts.length === 0) {
  //   return <p>There are no posts yet. Maybe start sharing some?</p>;
  // }

  // return (
  //   <ul className="posts">
  //     {posts.map((post) => (
  //       <li key={post.id}>
  //         <Post post={post} />
  //       </li>
  //     ))}
  //   </ul>
  // );
}
