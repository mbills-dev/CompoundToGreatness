import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { handleEarlyAccess, memoryLimiter } from './api/early-access';

/**
 * Dev server only (`npm run dev`): serves /early-access the way Vercel does, and answers POST /api/early-access with
 * the REAL handler against a fake Kit — no network, no key. Test addresses:
 *   anything@example.com   → success
 *   …+fail@…               → Kit keeps failing → "couldn't save" (503)
 *   …+slow@…               → success after 2.5 s (loading state)
 *   …+bad@…                → Kit rejects the address (400)
 */
function earlyAccessDev(): Plugin {
  const limiter = memoryLimiter();
  return {
    name: 'ctg-early-access-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        if (url === '/early-access' || url.startsWith('/early-access?')) {
          req.url = '/early-access/' + url.slice('/early-access'.length);
          return next();
        }
        if (!url.startsWith('/api/early-access')) return next();
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const raw = Buffer.concat(chunks);
        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
        headers.set('x-forwarded-for', '127.0.0.1');
        const request = new Request(`http://${req.headers.host}${url}`, {
          method: req.method, headers, body: req.method === 'POST' ? raw : undefined,
        });
        let email = '';
        try { email = String(JSON.parse(raw.toString('utf8')).email ?? ''); } catch { /* not JSON */ }
        const fakeKit = (async (input: Parameters<typeof fetch>[0]) => {
          const path = String(input);
          if (email.includes('+slow')) await new Promise((r) => setTimeout(r, 2500));
          const createStep = path.endsWith('/v4/subscribers');
          const status = email.includes('+fail') ? 500 : email.includes('+bad') && createStep ? 422 : 201;
          return new Response('{}', { status });
        }) as typeof fetch;
        const response = await handleEarlyAccess(request, {
          env: { KIT_API_KEY: 'dev-mock', KIT_EARLY_ACCESS_FORM_ID: '10187227', KIT_EARLY_ACCESS_TAG_ID: '25842370' },
          fetch: fakeKit,
          now: Date.now,
          sleep: (ms) => new Promise((r) => setTimeout(r, Math.min(ms, 50))),
          log: (line) => server.config.logger.info(`[early-access mock] ${JSON.stringify(line)}`),
          limiter,
        });
        res.statusCode = response.status;
        response.headers.forEach((v, k) => res.setHeader(k, v));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), earlyAccessDev()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        earlyAccess: resolve(__dirname, 'early-access/index.html'),
      },
    },
  },
});
