import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        let data;
        try {
            data = await request.json();
        } catch (e) {
            console.error('[Admin API] Error parsing JSON body:', e);
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
        }

        const { filename, content } = data;

        console.log(`[Admin API] Saving file: ${filename}`);

        if (!filename || !content) {
            console.error('[Admin API] Missing filename or content');
            return new Response(JSON.stringify({ error: 'Missing filename or content' }), { status: 400 });
        }

        // Ensure we only write to the blog directory for safety
        const blogDir = path.join(process.cwd(), 'src/pages/blog');
        const filePath = path.join(blogDir, filename);

        console.log(`[Admin API] Target path: ${filePath}`);

        if (!filePath.startsWith(blogDir)) {
            console.error('[Admin API] Invalid file path');
            return new Response(JSON.stringify({ error: 'Invalid file path' }), { status: 403 });
        }

        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`[Admin API] File saved successfully`);

        return new Response(JSON.stringify({ success: true, message: 'File saved successfully' }), { status: 200 });
    } catch (error: any) {
        console.error('[Admin API] Error saving file:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
