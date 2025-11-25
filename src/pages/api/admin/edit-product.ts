import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const product = await request.json();

        console.log(`[Admin API] Updating product: ${product.id}`);

        // Validate required fields
        if (!product.id || !product.name || !product.description || !product.image || !product.link || !product.platform) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Read the current affiliates.ts file
        const currentDir = fileURLToPath(new URL('.', import.meta.url));
        const projectRoot = path.resolve(currentDir, '../../../../');
        const affiliatesPath = path.join(projectRoot, 'src/lib/affiliates.ts');
        let fileContent = await fs.readFile(affiliatesPath, 'utf-8');

        // Construct the new product entry string
        const newProductEntry = `{
        id: ${JSON.stringify(product.id)},
        name: ${JSON.stringify(product.name)},
        description: ${JSON.stringify(product.description)},
        ${product.price ? `price: ${JSON.stringify(product.price)},` : ''}
        ${product.originalPrice ? `originalPrice: ${JSON.stringify(product.originalPrice)},` : ''}
        ${product.discount ? `discount: ${JSON.stringify(product.discount)},` : ''}
        image: ${JSON.stringify(product.image)},
        link: ${JSON.stringify(product.link)},
        platform: ${JSON.stringify(product.platform)},
        category: ${JSON.stringify(product.category || 'General')},
        tags: [${product.tags?.map((t: string) => JSON.stringify(t)).join(', ') || ''}],
        ${product.rating ? `rating: ${product.rating},` : ''}
        ${product.verified ? `verified: true` : ''}
    }`;

        // Find the product block to replace
        // We look for { ... id: 'product-id' ... }
        // The regex looks for:
        // 1. { (start of object)
        // 2. Any whitespace
        // 3. id: 'product.id' (or "product.id")
        // 4. Any content until the matching closing brace }

        // Note: This regex assumes the standard formatting we use. 
        // It matches from the opening { containing the ID, up to the next } that is followed by a comma or end of array.

        const regex = new RegExp(`\\{\\s*id:\\s*['"]${product.id}['"][\\s\\S]*?\\}`, 'g');

        if (!regex.test(fileContent)) {
            return new Response(JSON.stringify({ error: 'Product not found in file' }), { status: 404 });
        }

        fileContent = fileContent.replace(regex, newProductEntry);

        // Write back to file
        await fs.writeFile(affiliatesPath, fileContent, 'utf-8');
        console.log(`[Admin API] Product updated successfully`);

        return new Response(JSON.stringify({ success: true, message: 'Product updated successfully' }), { status: 200 });
    } catch (error: any) {
        console.error('[Admin API] Error updating product:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
