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

const isFiniteNumber = (value: unknown): value is number =>
    Number.isFinite(value);

const countArticles = async () => {
    try {
        const files = await fs.readdir(BLOG_DIR);
        let totalClicks = 0;

        for (const file of files) {
            if (!file.endsWith(".md")) continue;

            const content = await fs.readFile(path.join(BLOG_DIR, file), "utf-8");
            const { data } = matter(content);
            const clicks = Number(data?.clicks ?? data?.click_count ?? 0);

            if (isFiniteNumber(clicks)) {
                totalClicks += clicks;
            }
        }

        return {
            count: files.filter((file) => file.endsWith(".md")).length,
            clicks: totalClicks,
        };
    } catch (error) {
        console.warn("[Analytics] Unable to read articles", error);
        return { count: 0, clicks: 0 };
    }
};

const countProducts = async () => {
    try {
        const content = await fs.readFile(AFFILIATE_DATA_PATH, "utf-8");
        const products = JSON.parse(content) as Array<{ clicks?: number }>;
        const totalClicks = products.reduce(
            (sum, product) =>
                isFiniteNumber(product?.clicks) ? sum + product.clicks : sum,
            0,
        );

        return { count: products.length, clicks: totalClicks };
    } catch (error) {
        console.warn("[Analytics] Unable to read affiliate products", error);
        return { count: 0, clicks: 0 };
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
