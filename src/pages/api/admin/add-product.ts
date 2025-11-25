import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const product = await request.json();

        console.log(`[Admin API] Adding product: ${product.id}`);

        // Validate required fields
        if (!product.id || !product.name || !product.description || !product.image || !product.link || !product.platform) {
            console.error('[Admin API] Missing required fields');
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Read the current affiliates.ts file
        const currentDir = fileURLToPath(new URL('.', import.meta.url));
        const projectRoot = path.resolve(currentDir, '../../../../');
        const affiliatesPath = path.join(projectRoot, 'src/lib/affiliates.ts');
        let fileContent = await fs.readFile(affiliatesPath, 'utf-8');

        // Create the new product entry
        // Use JSON.stringify for strings to ensure proper escaping of quotes and newlines
        const newProductEntry = `    {
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

        // Find the affiliateProducts array and add the new product
        const arrayMatch = fileContent.match(/export const affiliateProducts: AffiliateProduct\[\] = \[([\s\S]*?)\];/);

        if (!arrayMatch) {
            return new Response(JSON.stringify({ error: 'Could not find affiliateProducts array' }), { status: 500 });
        }

        const existingProducts = arrayMatch[1].trimEnd(); // Trim end to handle existing trailing commas/spaces
        // Add comma if existing content is not empty and doesn't end with comma
        const separator = existingProducts.trim().length > 0 && !existingProducts.trim().endsWith(',') ? ',' : '';

        const updatedProducts = existingProducts + separator + '\n' + newProductEntry;

        fileContent = fileContent.replace(
            /export const affiliateProducts: AffiliateProduct\[\] = \[([\s\S]*?)\];/,
            `export const affiliateProducts: AffiliateProduct[] = [${updatedProducts}\n];`
        );

        // Write back to file
        await fs.writeFile(affiliatesPath, fileContent, 'utf-8');
        console.log(`[Admin API] Product added successfully`);

        return new Response(JSON.stringify({ success: true, message: 'Product added successfully' }), { status: 200 });
    } catch (error: any) {
        console.error('[Admin API] Error adding product:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
};
