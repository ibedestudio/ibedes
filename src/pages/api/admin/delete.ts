import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        let data;
        try {
            data = await request.json();
        } catch (e) {
            console.error('[Admin API] Error parsing JSON body:', e);
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { filename } = data;

        console.log(`[Admin API] Deleting file: ${filename}`);

        if (!filename) {
            console.error('[Admin API] Missing filename');
            return new Response(JSON.stringify({ error: 'Missing filename' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get project root - works in both dev and Netlify
        const currentDir = fileURLToPath(new URL('.', import.meta.url));
        const projectRoot = path.resolve(currentDir, '../../../../');
        const blogDir = path.join(projectRoot, 'src/pages/blog');
        const filePath = path.join(blogDir, filename);

        console.log(`[Admin API] Target path: ${filePath}`);

        if (!filePath.startsWith(blogDir)) {
            console.error('[Admin API] Invalid file path');
            return new Response(JSON.stringify({ error: 'Invalid file path' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            return new Response(JSON.stringify({ error: 'File not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await fs.unlink(filePath);
        console.log(`[Admin API] File deleted successfully`);

        return new Response(JSON.stringify({ success: true, message: 'File deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('[Admin API] Error deleting file:', error);
        console.error('[Admin API] Error stack:', error.stack);
        return new Response(JSON.stringify({
            error: error.message || 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
