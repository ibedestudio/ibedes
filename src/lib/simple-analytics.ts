// Simple analytics tracking for popular posts
const VIEWS_STORAGE_KEY = 'ibedes_blog_views';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

// Type declarations
declare global {
  function gtag(command: string, targetId: string, config?: any): void;
}

export interface ViewData {
  slug: string;
  views: number;
  lastViewed: string;
}

export interface ArticleWithViews {
  title: string;
  description: string;
  time: number;
  filename: string;
  views: number;
}

/**
 * Track a page view for popular posts calculation
 */
export const trackView = (slug: string, title?: string) => {
  if (typeof window === 'undefined') return;

  try {
    // Track in Google Analytics
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.href,
        custom_parameter_slug: slug
      });
    }

    // Track locally
    const views = getLocalViews();
    const now = new Date().toISOString();
    
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
    
    // Clean old data (30 days)
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)).toISOString();
    Object.keys(views).forEach(key => {
      if (views[key].lastViewed < thirtyDaysAgo) {
        delete views[key];
      }
    });
    
    localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(views));
  } catch (error) {
    console.warn('Failed to track view:', error);
  }
};

/**
 * Get local view data
 */
export const getLocalViews = (): Record<string, ViewData> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(VIEWS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Calculate popular articles
 */
export const getPopularArticles = (articles: any[]): ArticleWithViews[] => {
  const localViews = getLocalViews();
  
  const articlesWithViews = articles.map(article => {
    const slug = extractSlug(article.filename);
    const viewData = localViews[slug];
    
    return {
      ...article,
      views: viewData?.views || 0
    };
  });

  // Sort by views and return top 3
  return articlesWithViews
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);
};

/**
 * Extract slug from filename
 */
export const extractSlug = (filename: string): string => {
  return filename.split('/').pop()?.replace('.md', '') || filename;
};

/**
 * Make functions available globally
 */
if (typeof window !== 'undefined') {
  (window as any).ibedesAnalytics = {
    trackView,
    getLocalViews,
    getPopularArticles,
    extractSlug
  };
}