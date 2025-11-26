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
            return [];
        }
        throw new Error("Could not retrieve notifications.");
    }
}

async function saveNotifications(notifications: any[]) {
    try {
        await fs.writeFile(
            NOTIFICATIONS_PATH,
            JSON.stringify(notifications, null, 2),
        );
    } catch (error) {
        console.error("Failed to save notifications:", error);
        throw new Error("Could not save notifications.");
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const { ids } = await request.json();
        if (!Array.isArray(ids)) {
            return new Response(
                JSON.stringify({ error: "Invalid payload: 'ids' must be an array." }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            );
        }

        const notifications = await getNotifications();
        const initialCount = notifications.length;

        const updatedNotifications = notifications.filter(
            (notification: any) => !ids.includes(notification.id),
        );

        const deletedCount = initialCount - updatedNotifications.length;

        if (deletedCount > 0) {
            await saveNotifications(updatedNotifications);
        }

        return new Response(
            JSON.stringify({
                message: `${deletedCount} notification(s) deleted.`,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
