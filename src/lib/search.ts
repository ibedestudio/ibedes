import { getArticles, getProjects } from "./list";
import { SERVICES } from "./services";

export type SearchItem = {
  title: string;
  description: string;
  url: string;
  type: "article" | "service" | "project";
  tags?: string[];
};

/**
 * Collects searchable content (articles, services, projects) into a single list.
 * Articles and projects are read from markdown entries, services are in-memory.
 */
export const getSearchItems = async (): Promise<SearchItem[]> => {
  const [articles, projects] = await Promise.all([
    getArticles(),
    getProjects(),
  ]);

  const articleItems: SearchItem[] = articles.map((article) => ({
    title: article.title,
    description: article.description,
    url: article.filename,
    type: "article",
    tags: article.tags,
  }));

  const projectItems: SearchItem[] = projects.map((project) => ({
    title: project.title,
    description: project.description,
    url: project.filename,
    type: "project",
    tags: project.tags,
  }));

  const serviceItems: SearchItem[] = SERVICES.map((service) => ({
    title: service.title,
    description: service.summary,
    url: `/services/${service.slug}`,
    type: "service",
  }));

  return [...articleItems, ...serviceItems, ...projectItems];
};
