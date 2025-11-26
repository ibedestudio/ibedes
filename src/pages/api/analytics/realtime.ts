import type { APIRoute } from "astro";
import crypto from "crypto";

export const prerender = false;

const tokenEndpoint = "https://oauth2.googleapis.com/token";
const realtimeEndpoint = "https://analyticsdata.googleapis.com/v1beta";

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
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion,
        }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
        const errorMessage =
            tokenData?.error_description || tokenData?.error || "Token request failed";
        throw new Error(errorMessage);
    }

    if (!tokenData.access_token) {
        throw new Error("No access token returned from Google");
    }

    return tokenData.access_token as string;
}

export const GET: APIRoute = async () => {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const clientEmail = process.env.GA4_CLIENT_EMAIL;
    const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!propertyId || !clientEmail || !privateKey) {
        return new Response(
            JSON.stringify({
                error: "Google Analytics belum dikonfigurasi. Tambahkan GA4_PROPERTY_ID, GA4_CLIENT_EMAIL, dan GA4_PRIVATE_KEY di environment server.",
            }),
            {
                status: 501,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    try {
        const accessToken = await getAccessToken(clientEmail, privateKey);

        const response = await fetch(
            `${realtimeEndpoint}/properties/${propertyId}:runRealtimeReport`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    metrics: [{ name: "activeUsers" }],
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            const message = data?.error?.message || "Gagal mengambil data realtime";
            throw new Error(message);
        }

        const activeUsers = Number(
            data?.rows?.[0]?.metricValues?.[0]?.value ?? data?.totals?.[0]?.metricValues?.[0]?.value ?? 0,
        );

        return new Response(
            JSON.stringify({
                activeUsers: Number.isFinite(activeUsers) ? activeUsers : 0,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store, no-cache, must-revalidate",
                },
            },
        );
    } catch (error) {
        console.error("[GA4] Realtime fetch failed", error);
        const message = error instanceof Error ? error.message : "Terjadi kesalahan";
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
