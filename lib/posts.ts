import sql from 'better-sqlite3';
import { cacheLife, cacheTag } from 'next/cache';

/** Row shape of the `users` table. */
export interface UserProps {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PostProps {
  id: number;
  image: string;
  title: string;
  content: string;
  createdAt: string;
  userFirstName: string;
  userLastName: string;
  likes: number;
  isLiked: 0 | 1; // SQLite EXISTS() returns 0 or 1
}

export interface NewPostProps {
  imageUrl: string;
  title: string;
  content: string;
  userId: number;
}


const db = new sql('posts.db');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      first_name TEXT, 
      last_name TEXT,
      email TEXT
    )`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY, 
      image_url TEXT NOT NULL,
      title TEXT NOT NULL, 
      content TEXT NOT NULL, 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER, 
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      user_id INTEGER, 
      post_id INTEGER, 
      PRIMARY KEY(user_id, post_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
    )`);

  const stmt = db.prepare('SELECT COUNT(*) AS count FROM users');

  if ((stmt.get() as { count: number }).count === 0) {
    db.exec(`
    INSERT INTO users (first_name, last_name, email)
    VALUES ('John', 'Doe', 'john@example.com')
  `);

    db.exec(`
    INSERT INTO users (first_name, last_name, email)
    VALUES ('Max', 'Schwarz', 'max@example.com')
  `);
  }
}

initDb();

// ---- Data access -------------------------------------------------------

export async function getPosts(maxNumber?: number): Promise<PostProps[]> {
  // [IMPORTANT!]
  // Since nextjs 16, NextJS tweaks the cache policy.
  // Before nextjs 16, we need wrap the function with `unstable_cache` (it works in v16)
  // Now, instead of it, we can use `use cache`.
  // Without `unstable_cache` or `use cache`, the cache does not work in dev and production mode.

  'use cache';
  cacheLife('hours');
  cacheTag('posts');

  // v14: `fetch` is cached by default (force-cache).
  // v15: `fetch` is uncached by default. Use `unstable_cache` to cache
  //      non-fetch async functions (e.g. DB queries); for `fetch`, pass
  //      `{ cache: 'force-cache' }` explicitly.
  // v16: prefer the `use cache` directive for any async function
  //      (including DB queries and `fetch`); it replaces `unstable_cache`.

  // Must be aware of this. With cache!, it does not rerender the page
  // even if the data is changed. The page is pre-rendered in the server. That is it!

  let limitClause = '';

  if (maxNumber) {
    limitClause = 'LIMIT ?';
  }

  const stmt = db.prepare(`
    SELECT posts.id, image_url AS image, title, content, created_at AS createdAt, first_name AS userFirstName, last_name AS userLastName, COUNT(likes.post_id) AS likes, EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked
    FROM posts
    INNER JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id
    ORDER BY createdAt DESC
    ${limitClause}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (maxNumber ? stmt.all(maxNumber) : stmt.all()) as PostProps[];
}

// Need to use `use cache` to be cached in the browser.
export async function storePost(post: NewPostProps): Promise<sql.RunResult> {
  const stmt = db.prepare(`
    INSERT INTO posts (image_url, title, content, user_id)
    VALUES (?, ?, ?, ?)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.run(post.imageUrl, post.title, post.content, post.userId);
}

export async function updatePostLikeStatus(
  postId: number,
  userId: number
): Promise<sql.RunResult> {
  const stmt = db.prepare(`
    SELECT COUNT(*) AS count
    FROM likes
    WHERE user_id = ? AND post_id = ?`
  );

  const { count } = stmt.get(userId, postId) as { count: number };
  const isLiked = count === 0;

  if (isLiked) {
    const insertStmt = db.prepare(`
      INSERT INTO likes (user_id, post_id)
      VALUES (?, ?)`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return insertStmt.run(userId, postId);
  } else {
    const deleteStmt = db.prepare(`
      DELETE FROM likes
      WHERE user_id = ? AND post_id = ?`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return deleteStmt.run(userId, postId);
  }
}