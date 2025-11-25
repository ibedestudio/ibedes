import type { APIRoute } from 'astro';
import { getGitHubCMS } from '../../../lib/github-cms';

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

        const { filename, content } = data;

        console.log(`[Admin API] Saving file via GitHub: ${filename}`);

        if (!filename || !content) {
            console.error('[Admin API] Missing filename or content');
            return new Response(JSON.stringify({ error: 'Missing filename or content' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate filename (security)
        if (filename.includes('..') || filename.startsWith('/')) {
            console.error('[Admin API] Invalid filename');
            return new Response(JSON.stringify({ error: 'Invalid filename' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Use GitHub CMS to save file
        const github = getGitHubCMS();
        const filePath = `src/pages/blog/${filename}`;
        const commitMessage = `Update article: ${filename}`;

        await github.saveFile(filePath, content, commitMessage);

        console.log(`[Admin API] File saved successfully via GitHub`);

        return new Response(JSON.stringify({
            success: true,
            message: 'File saved successfully. Netlify will auto-deploy in ~2 minutes.'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        console.error('[Admin API] Error saving file:', error);
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
