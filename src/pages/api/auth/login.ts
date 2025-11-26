import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const body = await request.json();
        const { username, password } = body;

        const adminUser = import.meta.env.ADMIN_USER || process.env.ADMIN_USER;
        const adminPassword = import.meta.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

        if (!adminUser || !adminPassword) {
            return new Response(
                JSON.stringify({ error: "Server configuration error" }),
                { status: 500 }
            );
        }

        if (username === adminUser && password === adminPassword) {
            // Set session cookie
            // In a real app, use a secure token or JWT
            cookies.set("admin_session", "authenticated", {
                path: "/",
                httpOnly: true,
                secure: import.meta.env.PROD,
                maxAge: 60 * 60 * 24 * 7, // 1 week
                sameSite: "strict",
            });

            return new Response(
                JSON.stringify({ success: true }),
                { status: 200 }
            );
        } else {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }),
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
};
