// Affiliate management system for ibedes.xyz

import fs from "node:fs/promises";
import path from "node:path";

export interface AffiliateProduct {
    id: string;
    name: string;
    description: string;
    price?: string;
    originalPrice?: string;
    discount?: string;
    image: string;
    link: string;
    platform: 'shopee' | 'tokopedia' | 'lazada' | 'blibli' | 'tiktok' | 'amazon' | 'other';
    category: string;
    tags: string[];
    rating?: number;
    verified?: boolean; // produk yang sudah dicek/direkomendasikan
}

export interface ArticleAffiliate {
    articleSlug: string;
    productIds: string[];
    context?: string; // context untuk menampilkan produk (contoh: "Produk yang membantu perjalanan spiritual")
}

const AFFILIATE_DATA_PATH = path.join(
    process.cwd(),
    "src/data/affiliate-products.json",
);

async function readAffiliateFile(): Promise<AffiliateProduct[]> {
    try {
        const content = await fs.readFile(AFFILIATE_DATA_PATH, "utf-8");
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            return parsed as AffiliateProduct[];
        }
        console.warn(
            "[Affiliate Store] affiliate-products.json is not an array. Returning empty list.",
        );
        return [];
    } catch (error) {
        console.error("[Affiliate Store] Failed to read affiliate products:", error);
        return [];
    }
}

export async function loadAffiliateProducts(): Promise<AffiliateProduct[]> {
    return readAffiliateFile();
}

// Mapping artikel dengan produk affiliate
export const articleAffiliates: ArticleAffiliate[] = [];

// Helper functions
export function getAffiliateByArticle(articleSlug: string): ArticleAffiliate | null {
    return articleAffiliates.find(aff => aff.articleSlug === articleSlug) || null;
}

export async function getAffiliateProductsByIds(productIds: string[]): Promise<AffiliateProduct[]> {
    const products = await loadAffiliateProducts();
    return productIds
        .map(id => products.find(product => product.id === id))
        .filter((product): product is AffiliateProduct => product !== undefined);
}

export async function getProductsByCategory(category: string): Promise<AffiliateProduct[]> {
    const products = await loadAffiliateProducts();
    return products.filter(product =>
        product.category?.toLowerCase() === category.toLowerCase()
    );
}

export async function getProductsByTags(tags: string[]): Promise<AffiliateProduct[]> {
    const products = await loadAffiliateProducts();
    return products.filter(product =>
        tags.some(tag => product.tags.includes(tag))
    );
}

export async function getVerifiedProducts(): Promise<AffiliateProduct[]> {
    const products = await loadAffiliateProducts();
    return products.filter(product => product.verified);
}

// Platform configuration
export const platformConfig = {
    shopee: {
        name: 'Shopee',
        color: '#EE4D2D',
        icon: 'fa-solid fa-cart-shopping'
    },
    tokopedia: {
        name: 'Tokopedia',
        color: '#42B549',
        icon: 'fa-solid fa-store'
    },
    lazada: {
        name: 'Lazada',
        color: '#0F1471',
        icon: 'fa-solid fa-bag-shopping'
    },
    blibli: {
        name: 'Blibli',
        color: '#0095DA',
        icon: 'fa-solid fa-basket-shopping'
    },
    tiktok: {
        name: 'TikTok Shop',
        color: '#000000',
        icon: 'fa-brands fa-tiktok'
    },
    amazon: {
        name: 'Amazon',
        color: '#FF9900',
        icon: 'fa-brands fa-amazon'
    },
    other: {
        name: 'Lainnya',
        color: '#6B7280',
        icon: 'fa-solid fa-link'
    }
};
