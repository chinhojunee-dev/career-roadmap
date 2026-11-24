// 운영 서버:  BASE_PATH=/<아이디> PORT=6000 node server.mjs
// 프록시가 /<아이디> 접두사를 떼고 전달해도, 접두사로 빌드된 Next 가 요청을 알아보게 주소를 복원한다.
import http from 'node:http';
import next from 'next';

const port = Number(process.env.PORT || 6000);
const base = process.env.BASE_PATH || '';
const app = next({ dev: false, hostname: '0.0.0.0', port });
const handle = app.getRequestHandler();
await app.prepare();

http.createServer((req, res) => {
  const u = req.url || '/';
  const hasBase = u === base || u.startsWith(base + '/') || u.startsWith(base + '?');
  if (base && !hasBase) req.url = u === '/' ? base : base + u;   // '/roadmap' → '/<아이디>/roadmap'  (루트는 슬래시 리다이렉트를 피하려고 base 그대로)
  handle(req, res);
}).listen(port, '0.0.0.0', () => console.log(`ready on :${port} basePath=${base || '(none)'}`));
