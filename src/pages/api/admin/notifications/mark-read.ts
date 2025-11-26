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
        let updatedCount = 0;

        const updatedNotifications = notifications.map((notification: any) => {
            if (ids.includes(notification.id)) {
                if (notification.status !== "read") {
                    updatedCount++;
                    return { ...notification, status: "read" };
                }
            }
            return notification;
        });

        if (updatedCount > 0) {
            await saveNotifications(updatedNotifications);
        }

        return new Response(
            JSON.stringify({
                message: `${updatedCount} notification(s) marked as read.`,
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
