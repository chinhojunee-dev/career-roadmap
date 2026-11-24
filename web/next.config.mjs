/** @type {import('next').NextConfig} */
// 공개 주소가 https://호스트/<아이디>/ 인 환경: BASE_PATH=/<아이디> 로 빌드하면 링크·정적 파일 주소에 접두사가 붙는다.
// 프록시가 접두사를 떼고 전달하는 요청은 server.mjs 가 접두사를 다시 붙여 Next 에 넘긴다.
const basePath = process.env.BASE_PATH || '';

export default {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};
