import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect } = context;

    // Check if the request is for the admin area
    if (url.pathname.startsWith("/admin")) {
        // Allow access to the login page and API routes used for login
        if (
            url.pathname === "/admin/login" ||
            url.pathname === "/api/auth/login" ||
            url.pathname === "/api/auth/logout"
        ) {
            return next();
        }

        // Check for the admin session cookie
        const adminSession = cookies.get("admin_session");

        if (!adminSession || !adminSession.value) {
            // Redirect to login if no session exists
            return redirect("/admin/login");
        }
    }

    return next();
});
