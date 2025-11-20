import fs from "node:fs/promises";
import { GLOBAL } from "./variables";

type MarkdownData<T extends object> = {
  frontmatter: T;
  file: string;
  url: string;
};


/**
 * This function processes the content of a directory and returns an array of processed content.
 * It takes a content type, a function to process the content, and an optional directory.
 * If no directory is provided, it defaults to the current working directory.
 * 
 * @param contentType the type of content to process
 * @param processFn the function to process the content
 * @param dir the directory to process the content from
 * @returns a promise that resolves to an array of processed content
 */
export const processContentInDir = async <T extends object, K>(
  contentType: "projects" | "blog",
  processFn: (data: MarkdownData<T>) => K,
) => {
  let content;
  if (contentType === "projects") {
    content = import.meta.glob(`/src/pages/projects/*.md`);
  } else {
    content = import.meta.glob(`/src/pages/blog/*.md`);
  }

  const promises = Object.values(content).map(async (importer) => {
    const data = (await importer()) as MarkdownData<T>;
    return processFn(data);
  });

  return await Promise.all(promises);
};

/**
 * Shortens a string by removing words at the end until it fits within a certain length.
 * @param content the content to shorten
 * @param maxLength the maximum length of the shortened content (default is 20)
 * @returns a shortened version of the content
 */
export const getShortDescription = (content: string = "", maxLength = 20) => {
  const trimmed = content.trim();
  if (!trimmed) return "";
  const splitByWord = trimmed.split(/\s+/);
  const length = splitByWord.length;
  return length > maxLength ? splitByWord.slice(0, maxLength).join(" ") + "..." : content;
};

/**
 * Processes the date of an article and returns a string representing the processed date.
 * @param timestamp the timestamp to process
 * @returns a string representing the processed timestamp
 */
export const processArticleDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const monthSmall = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${monthSmall} ${day}, ${year}`;
};

/**
 * Generates a source URL for a content item. The URL is used in meta tags and social media cards.
 * @param sourceUrl the source URL of the content
 * @param contentType the type of content (either "projects" or "blog")
 * @returns a string representing the source URL with the appropriate domain
 */
export const generateSourceUrl = (
  sourceUrl: string,
  contentType: "projects" | "blog",
) => {
  return `${GLOBAL.rootUrl}/${contentType}/${sourceUrl}`;
};

/**
 * Converts a tag string into a URL-friendly slug.
 * @param tag the raw tag text
 * @returns a kebab-case slug
 */
export const slugifyTag = (tag: string = "") => {
  return tag
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/**
 * Removes HTML tags from a string and normalizes whitespace.
 * Useful when the text may include markup for display purposes but needs a plain value for metadata.
 * @param content the string that may contain HTML
 * @returns a plain text version of the string
 */
export const stripHtml = (content: string = "") => {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
