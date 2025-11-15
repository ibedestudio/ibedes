// Analytics integration for tracking and fetching popular content
export interface PopularityData {
  slug: string;
  views: number;
  lastViewed: Date;
}

export interface ArticlePopularity extends PopularityData {
  title: string;
  description: string;
  url: string;
  time: number;
}

// Local storage keys
const VIEWS_STORAGE_KEY = 'ibedes_blog_views';
const POPULARITY_CACHE_KEY = 'ibedes_popular_cache';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Track a page view for popular posts calculation
 */
export const trackPageView = (slug: string, title?: string) => {
  if (typeof window === 'undefined') return;

  try {
    // Track in Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        custom_parameter_slug: slug
      });
    }

    // Track locally for real-time popularity
    const views = getLocalViews();
    const now = new Date();
    
    if (views[slug]) {
      views[slug].views += 1;
      views[slug].lastViewed = now;
    } else {
      views[slug] = {
        slug,
        views: 1,
        lastViewed: now
      };
    }
    
    // Keep only recent views (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    Object.keys(views).forEach(key => {
      if (new Date(views[key].lastViewed) < thirtyDaysAgo) {
        delete views[key];
      }
    });
    
    localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(views));
    
    // Clear cache to force recalculation
    localStorage.removeItem(POPULARITY_CACHE_KEY);
  } catch (error) {
    console.warn('Failed to track page view:', error);
  }
};

/**
 * Get local view data
 */
export const getLocalViews = (): Record<string, PopularityData> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(VIEWS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Calculate popular articles based on local data
 * Returns up to 3 most popular articles
 */
export const getPopularArticles = async (
  articles: Array<{
    title: string;
    description: string;
    time: number;
    timestamp: string;
    filename: string;
    slug?: string;
  }>
): Promise<ArticlePopularity[]> => {
  // Check cache first
  const cached = getCachedPopularArticles();
  if (cached.length > 0) {
    return cached;
  }

  const localViews = getLocalViews();
  const articlesWithViews = articles.map(article => {
    const slug = article.slug || extractSlugFromFilename(article.filename);
    const viewData = localViews[slug];
    
    return {
      ...article,
      slug,
      views: viewData?.views || 0,
      lastViewed: viewData?.lastViewed || new Date(0),
      url: article.filename,
    } as ArticlePopularity;
  });

  // Sort by views (descending) and take top 3
  const popular = articlesWithViews
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  // Cache the result
  cachePopularArticles(popular);
  
  return popular;
};

/**
 * Extract slug from filename (e.g., "/blog/some-post" -> "some-post")
 */
export const extractSlugFromFilename = (filename: string): string => {
  return filename.split('/').pop()?.replace('.md', '') || filename;
};

/**
 * Get cached popular articles
 */
const getCachedPopularArticles = (): ArticlePopularity[] => {
  try {
    const cached = localStorage.getItem(POPULARITY_CACHE_KEY);
    if (!cached) return [];
    
    const { data, timestamp } = JSON.parse(cached);
    const now = new Date();
    const cachedTime = new Date(timestamp);
    
    // Return cached data if it's still fresh
    if (now.getTime() - cachedTime.getTime() < CACHE_DURATION) {
      return data || [];
    }
  } catch {
    // Ignore cache errors
  }
  
  return [];
};

/**
 * Cache popular articles for performance
 */
const cachePopularArticles = (articles: ArticlePopularity[]) => {
  try {
    const cacheData = {
      data: articles,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(POPULARITY_CACHE_KEY, JSON.stringify(cacheData));
  } catch {
    // Ignore cache errors
  }
};

/**
 * Track article reading progress (for future enhancement)
 */
export const trackReadingProgress = (slug: string, progress: number) => {
  if (typeof window === 'undefined') return;
  
  try {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'scroll', {
        custom_parameter_slug: slug,
        value: Math.round(progress)
      });
    }
  } catch (error) {
    console.warn('Failed to track reading progress:', error);
  }
};

/**
 * Get analytics data summary (for debugging/admin purposes)
 */
export const getAnalyticsSummary = () => {
  const localViews = getLocalViews();
  const totalViews = Object.values(localViews).reduce((sum, data) => sum + data.views, 0);
  
  return {
    totalViews,
    trackedArticles: Object.keys(localViews).length,
    recentViews: Object.values(localViews)
      .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
      .slice(0, 5)
  };
};