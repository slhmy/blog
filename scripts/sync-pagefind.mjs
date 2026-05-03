import { cp, mkdir, rm } from 'node:fs/promises';

await rm('public/pagefind', { force: true, recursive: true });
await mkdir('public', { recursive: true });
await cp('dist/pagefind', 'public/pagefind', { recursive: true });
