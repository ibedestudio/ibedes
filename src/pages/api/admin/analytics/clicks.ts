import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export const prerender = false;

const BLOG_DIR = path.join(process.cwd(), "src/pages/blog");
const AFFILIATE_DATA_PATH = path.join(
    process.cwd(),
    "src/data/affiliate-products.json",
);

type ArticleClick = {
    slug: string;
    title: string;
    clicks: number;
};

type ProductClick = {
    id: string;
    name: string;
    clicks: number;
};

const isFiniteNumber = (value: unknown): value is number =>
    Number.isFinite(value);

const normalizeClicks = (value: unknown): number => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};

const countArticles = async () => {
    try {
        const files = await fs.readdir(BLOG_DIR);
        let totalClicks = 0;
        const articleClicks: ArticleClick[] = [];

        for (const file of files) {
            if (!file.endsWith(".md")) continue;

            const content = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
            const { data } = matter(content);
            const clicks = normalizeClicks(
                data?.clicks ?? data?.click_count ?? data?.clickCount ?? 0,
            );

            totalClicks += clicks;
            const slug =
                data?.slug ??
                data?.url ??
                file.replace(/\.md$/, "");
            const title = data?.title ?? slug;

            articleClicks.push({
                slug,
                title,
                clicks,
            });
        }

        return {
            count: files.filter((file) => file.endsWith(".md")).length,
            clicks: totalClicks,
            articles: articleClicks,
        };
    } catch (error) {
        console.warn("[Analytics] Unable to read articles", error);
        return { count: 0, clicks: 0, articles: [] };
    }
};

const countProducts = async () => {
    try {
        const content = await fs.readFile(AFFILIATE_DATA_PATH, "utf-8");
        const products = JSON.parse(content) as Array<{
            id?: string;
            name?: string;
            clicks?: number;
        }>;
        const productClicks: ProductClick[] = products.map((product, index) => {
            const clicks = normalizeClicks(product?.clicks ?? 0);
            const id = product?.id ?? `product-${index + 1}`;

            return {
                id,
                name: product?.name ?? id,
                clicks,
            };
        });

        const totalClicks = productClicks.reduce(
            (sum, product) => sum + product.clicks,
            0,
        );

        return { count: products.length, clicks: totalClicks, products: productClicks };
    } catch (error) {
        console.warn("[Analytics] Unable to read affiliate products", error);
        return { count: 0, clicks: 0, products: [] };
    }
};

export const GET: APIRoute = async () => {
    const [articleStats, productStats] = await Promise.all([
        countArticles(),
        countProducts(),
    ]);

    const totals = {
        articles: articleStats.clicks,
        products: productStats.clicks,
        links: 0,
    };

    const responsePayload = {
        totals: {
            ...totals,
            total:
                (isFiniteNumber(totals.articles) ? totals.articles : 0) +
                (isFiniteNumber(totals.products) ? totals.products : 0) +
                (isFiniteNumber(totals.links) ? totals.links : 0),
        },
        meta: {
            articles: articleStats.count,
            products: productStats.count,
        },
        breakdown: {
            articles: articleStats.articles,
            products: productStats.products,
        },
        updatedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
        },
    });
};
