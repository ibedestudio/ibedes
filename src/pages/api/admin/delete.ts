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

        const { filename } = data;

        console.log(`[Admin API] Deleting file via GitHub: ${filename}`);

        if (!filename) {
            console.error('[Admin API] Missing filename');
            return new Response(JSON.stringify({ error: 'Missing filename' }), {
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

        // Use GitHub CMS to delete file
        const github = getGitHubCMS();
        const filePath = `src/pages/blog/${filename}`;
        const commitMessage = `Delete article: ${filename}`;

        await github.deleteFile(filePath, commitMessage);

        console.log(`[Admin API] File deleted successfully via GitHub`);

        return new Response(JSON.stringify({
            success: true,
            message: 'File deleted successfully. Netlify will auto-deploy in ~2 minutes.'
        }), {
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
