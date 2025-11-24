import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const { type, action, oldValue, newValue } = await request.json();

        if (!type || !action || !oldValue) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        const affiliatesPath = path.join(process.cwd(), 'src/lib/affiliates.ts');
        let fileContent = await fs.readFile(affiliatesPath, 'utf-8');

        if (type === 'category') {
            if (action === 'rename') {
                const categoryRenameRegex = new RegExp(`category:\\s*['"]${oldValue}['"]`, 'g');
                fileContent = fileContent.replace(categoryRenameRegex, `category: '${newValue}'`);
            } else if (action === 'delete') {
                const categoryDeleteRegex = new RegExp(`category:\\s*['"]${oldValue}['"]`, 'g');
                fileContent = fileContent.replace(categoryDeleteRegex, `category: 'General'`);
            }
        } else if (type === 'tag') {
            if (action === 'rename') {
                const tagArrayRegex = new RegExp(`tags:\\s*\\[([\\s\\S]*?)\\]`, 'g');
                fileContent = fileContent.replace(tagArrayRegex, (match, content) => {
                    const tagRenameRegex = new RegExp(`(['"])${oldValue}\\1`, 'g');
                    const newContent = content.replace(tagRenameRegex, `'${newValue}'`);
                    return `tags: [${newContent}]`;
                });
            } else if (action === 'delete') {
                const tagArrayDeleteRegex = new RegExp(`tags:\\s*\\[([\\s\\S]*?)\\]`, 'g');
                fileContent = fileContent.replace(tagArrayDeleteRegex, (match, content) => {
                    const tagDeleteRegex = new RegExp(`\\s*(['"])${oldValue}\\1\\s*,?`, 'g');
                    let newContent = content.replace(tagDeleteRegex, '');
                    newContent = newContent.trim();
                    if (newContent.endsWith(',')) newContent = newContent.slice(0, -1);
                    return `tags: [${newContent}]`;
                });
            }
        } else if (type === 'product') {
            if (action === 'delete') {
                // Delete entire product entry
                // Match product object by id
                const productDeleteRegex = new RegExp(`\\{\\s*id:\\s*['"]${oldValue}['"][\\s\\S]*?\\}\\s*,?`, 'g');
                fileContent = fileContent.replace(productDeleteRegex, '');

                // Clean up any double commas or trailing commas before closing bracket
                fileContent = fileContent.replace(/,\s*,/g, ',');
                fileContent = fileContent.replace(/,\s*\]/g, ']');
            }
        }

        await fs.writeFile(affiliatesPath, fileContent, 'utf-8');

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        console.error('[Admin Metadata API] Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
