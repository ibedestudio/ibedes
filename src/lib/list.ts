import type { ArticleFrontmatter, ProjectFrontmatter } from "./types";
import { getShortDescription, processContentInDir } from "./utils";

type ArticleListItem = ArticleFrontmatter;
type ProjectListItem = ProjectFrontmatter;

let articleCache: ArticleListItem[] | undefined;
let projectCache: ProjectListItem[] | undefined;

const sortByNewerDate = <T extends { timestamp: string }>(a: T, b: T) => {
  const dateA = new Date(a.timestamp).getTime();
  const dateB = new Date(b.timestamp).getTime();
  return dateB - dateA;
};

export const getArticles = async () => {
  if (articleCache) return articleCache;
  const items = await processContentInDir<ArticleFrontmatter, ArticleListItem>(
    "blog",
    (data) => {
      const shortDescription = getShortDescription(
        data.frontmatter.description,
      );
      return {
        title: data.frontmatter.title,
        description: shortDescription,
        tags: data.frontmatter.tags,
        time: data.frontmatter.time,
        featured: data.frontmatter.featured,
        timestamp: data.frontmatter.timestamp,
        filename: `/blog/${data.frontmatter.filename}`,
      };
    },
  );
  articleCache = items.sort(sortByNewerDate);
  return articleCache;
};

export const getProjects = async () => {
  if (projectCache) return projectCache;
  const items = await processContentInDir<ProjectFrontmatter, ProjectListItem>(
    "projects",
    (data) => {
      const shortDescription = getShortDescription(
        data.frontmatter.description,
      );
      return {
        title: data.frontmatter.title,
        description: shortDescription,
        tags: data.frontmatter.tags,
        githubUrl: data.frontmatter.githubUrl,
        liveUrl: data.frontmatter.liveUrl,
        featured: data.frontmatter.featured,
        timestamp: data.frontmatter.timestamp,
        filename: `/projects/${data.frontmatter.filename}`,
      };
    },
  );
  projectCache = items.sort(sortByNewerDate);
  return projectCache;
};
