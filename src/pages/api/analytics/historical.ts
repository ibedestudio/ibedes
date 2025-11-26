import type { APIRoute } from "astro";
import crypto from "crypto";

export const prerender = false;

const tokenEndpoint = "https://oauth2.googleapis.com/token";
const analyticsEndpoint = "https://analyticsdata.googleapis.com/v1beta";

const base64UrlEncode = (input: Buffer | string) =>
    Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");

async function getAccessToken(clientEmail: string, privateKey: string) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/analytics.readonly",
        aud: tokenEndpoint,
        exp: now + 3600,
        iat: now,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsignedToken);
    signer.end();

    const signature = signer.sign(privateKey);
    const encodedSignature = base64UrlEncode(signature);

    const assertion = `${unsignedToken}.${encodedSignature}`;

    const tokenResponse = await fetch(tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion,
        }).toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
        throw new Error(
            tokenData?.error_description || "Failed to get access token",
        );
    }
    return tokenData.access_token as string;
}

async function runReport(
    accessToken: string,
    propertyId: string,
    dateRanges: { startDate: string; endDate: string }[],
) {
    const response = await fetch(
        `${analyticsEndpoint}/properties/${propertyId}:runReport`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dateRanges: dateRanges,
                metrics: [{ name: "activeUsers" }],
            }),
        },
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error?.message || "Failed to fetch GA4 report");
    }
    return data;
}

export const GET: APIRoute = async () => {
    const propertyId = import.meta.env.GA4_PROPERTY_ID;
    const clientEmail = import.meta.env.GA4_CLIENT_EMAIL;
    const privateKey = import.meta.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!propertyId || !clientEmail || !privateKey) {
        return new Response(
            JSON.stringify({ error: "Google Analytics not configured" }),
            { status: 501, headers: { "Content-Type": "application/json" } },
        );
    }

    try {
        const accessToken = await getAccessToken(clientEmail, privateKey);
        const today = new Date();
        const startOfWeek = new Date(
            today.setDate(today.getDate() - today.getDay()),
        );
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const formatDate = (date: Date) => date.toISOString().split("T")[0];

        const [daily, weekly, monthly] = await Promise.all([
            runReport(accessToken, propertyId, [
                { startDate: "today", endDate: "today" },
            ]),
            runReport(accessToken, propertyId, [
                {
                    startDate: formatDate(startOfWeek),
                    endDate: "today",
                },
            ]),
            runReport(accessToken, propertyId, [
                {
                    startDate: formatDate(startOfMonth),
                    endDate: "today",
                },
            ]),
        ]);

        const getMetric = (report: any) =>
            Number(report?.rows?.[0]?.metricValues?.[0]?.value ?? 0);

        return new Response(
            JSON.stringify({
                daily: getMetric(daily),
                weekly: getMetric(weekly),
                monthly: getMetric(monthly),
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        );
    } catch (error) {
        console.error("[GA4] Historical fetch failed", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
