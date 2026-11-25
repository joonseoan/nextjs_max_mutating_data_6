// [IMPORTANT!!]
/*
  "use server"는 "이 함수를 서버 액션(API 요청을 통해 서버에서 실행되는 함수)으로 만들어 줘"
  라는 신호일 뿐, "이 파일/코드는 절대 클라이언트 번들에 포함되지 않게 숨겨 줘"라는 
  보안·격리 보장이 아닙니다.

  1. "use server"의 진짜 역할
  함수 내부 최상단이나 파일 최상단에 "use server"를 쓰면, Next.js는 해당 함수를
  서버 액션(Server Action)으로 등록합니다.클라이언트 컴포넌트에서 이 함수를 호출하면,
  브라우저가 직접 함수 코드를 실행하는 것이 아니라 Next.js가 뒤에서 HTTP 요청(POST)을 보내
  서버에서 실행되도록 연결해 줍니다.실행 자체는 서버에서 일어나지만, 클라이언트 컴포넌트에서
  import하거나 참조하는 과정에서 관련 모듈/번들 정보가 클라이언트에 노출되거나 
  번들링될 여지가 생길 수 있습니다. 즉, "코드 은닉이나 클라이언트 번들 유입 차단"을
  목적으로 만든 지시어가 아닙니다.

  2. 왜 server-only 패키지를 쓰라고 하는가?
  DB 접속 로직, 비밀 키(API Secret)를 다루는 헬퍼 함수, 내부 비즈니스 로직처럼 
  절대 클라이언트 번들에 섞여 들어가면 안 되는 코드가 있습니다.
  이때 import 'server-only';를 해당 파일 맨 위에 넣어 두면:실수로 이 파일이 클라이언트
  컴포넌트에서 import될 경우, Next.js 빌드(또는 컴파일) 단계에서 즉시 에러를 발생시켜 막아
  줍니다.즉, "use server"가 *실행 위치(서버 액션화)*에 관한 것이라면,
  server-only는 클라이언트 번들 유입을 빌드 타임에 강제 차단하는 안전장치입니다.

  3. 요약 비교
  구분                   "use server"                      server-only
  목적                   함수를 서버 액션으로 노출/연결          해당 모듈이 클라이언트 번들에 포함되는 것 차단
  클라이언트 import 시     서버 액션으로 호출 가능하도록 처리       빌드 에러로 차단
  기대할 점               서버에서 실행되는 액션 생성             민감한 서버 코드/비밀 로직 보호

  결론적으로 서버 액션으로 쓸 함수에는 "use server"를 쓰되, 클라이언트에 절대 노출되면
  안 되는 내부 서버 코드·비밀 로직 파일에는 server-only를 함께(또는 별도 모듈로 분리해)
  써서 실수를 원천 차단하라는 뜻입니다.
*/

'use server';

import { redirect } from "next/navigation";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

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

  let imageUrl: string;

  try {
    imageUrl = await uploadImage(image);
  } catch (err) {
    throw new Error(
      'Image upload failed, post was not created. Please try again.'
    );
  }

  await storePost({
    imageUrl,
    title,
    content,
    userId: 1,
  })

  // Since we use cache for `getPost` function that fetching data in /lib/posts,
  // we need to test `revalidatePath` works for the cache in production.
  revalidatePath('/', 'layout');

  redirect('/feed');
}

export async function togglePostLikeStatus(
  postId: number,
  // userId?: number
) {
  // userId 2 -> hard coded
  await updatePostLikeStatus(postId, 2);
  // For all pages
  // revalidatePath('/', 'layout');

  // For specific page
  revalidatePath('/feed');
}
