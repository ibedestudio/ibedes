import type { APIRoute } from "astro";
import fs from "node:fs/promises";
import path from "node:path";

export const prerender = false;

const NOTIFICATIONS_PATH = path.join(
    process.cwd(),
    "src/data/notifications.json",
);

async function getNotifications() {
    try {
        const content = await fs.readFile(NOTIFICATIONS_PATH, "utf-8");
        return JSON.parse(content);
    } catch (error) {
        if (error.code === "ENOENT") {
            // File doesn't exist, return empty array
            return [];
        }
        console.error("Failed to read notifications:", error);
        throw new Error("Could not retrieve notifications.");
    }
}

export const GET: APIRoute = async () => {
    try {
        const notifications = await getNotifications();
        return new Response(JSON.stringify(notifications), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
