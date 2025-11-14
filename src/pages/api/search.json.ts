import type { APIRoute } from "astro";
import { getSearchItems } from "../../lib/search";

export const GET: APIRoute = async () => {
  const items = await getSearchItems();
  return new Response(JSON.stringify(items), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
};
