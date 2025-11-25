import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return new Response(JSON.stringify({ error: 'File must be an image' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

        // Get project root - works in both dev and Netlify
        const currentDir = fileURLToPath(new URL('.', import.meta.url));
        const projectRoot = path.resolve(currentDir, '../../../../');
        const uploadDir = path.join(projectRoot, 'public/uploads');

        // Ensure uploads directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        const publicUrl = `/uploads/${filename}`;

        return new Response(JSON.stringify({
            success: true,
            url: publicUrl,
            message: 'File uploaded successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('[Upload API] Error:', error);
        console.error('[Upload API] Error stack:', error.stack);
        return new Response(JSON.stringify({
            error: error.message || 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
