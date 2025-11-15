// Smart Notification System for ibedes
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
  timestamp: number;
  read: boolean;
  category: 'new_content' | 'engagement' | 'system' | 'update';
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface SubscriptionPreferences {
  newArticles: boolean;
  weeklyDigest: boolean;
  systemUpdates: boolean;
  engagement: boolean;
  pushEnabled: boolean;
}

// Local storage keys
const NOTIFICATIONS_KEY = 'ibedes_notifications';
const PREFERENCES_KEY = 'ibedes_notification_preferences';
const SUBSCRIPTION_KEY = 'ibedes_push_subscription';

// Default preferences
const DEFAULT_PREFERENCES: SubscriptionPreferences = {
  newArticles: true,
  weeklyDigest: true,
  systemUpdates: true,
  engagement: true,
  pushEnabled: false
};

/**
 * Initialize notification system
 */
export const initNotifications = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      // Register service worker if not already registered
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        console.log('[Notifications] Service worker ready:', registration);
      }
      
      // Update preferences
      updatePreferences({ pushEnabled: true });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Notifications] Failed to initialize:', error);
    return false;
  }
};

/**
 * Get notification preferences
 */
export const getPreferences = (): SubscriptionPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

/**
 * Update notification preferences
 */
export const updatePreferences = (updates: Partial<SubscriptionPreferences>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const current = getPreferences();
    const updated = { ...current, ...updates };
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    
    // Update service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'UPDATE_PREFERENCES',
          preferences: updated
        });
      });
    }
  } catch (error) {
    console.error('[Notifications] Failed to update preferences:', error);
  }
};

/**
 * Get all notifications
 */
export const getNotifications = (): NotificationData[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save notifications to storage
 */
const saveNotifications = (notifications: NotificationData[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Keep only last 100 notifications
    const trimmed = notifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('[Notifications] Failed to save notifications:', error);
  }
};

/**
 * Add a new notification
 */
export const addNotification = (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>): string => {
  if (typeof window === 'undefined') return '';
  
  const id = generateId();
  const newNotification: NotificationData = {
    ...notification,
    id,
    timestamp: Date.now(),
    read: false
  };
  
  const notifications = getNotifications();
  notifications.push(newNotification);
  saveNotifications(notifications);
  
  // Show push notification if enabled and permission granted
  showPushNotification(newNotification);
  
  // Trigger custom event for UI updates
  window.dispatchEvent(new CustomEvent('notificationsUpdated', { detail: newNotification }));
  
  return id;
};

/**
 * Mark notification as read
 */
export const markAsRead = (id: string): void => {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);
  
  if (notification) {
    notification.read = true;
    saveNotifications(notifications);
    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = (): void => {
  const notifications = getNotifications();
  notifications.forEach(n => n.read = true);
  saveNotifications(notifications);
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

/**
 * Delete notification
 */
export const deleteNotification = (id: string): void => {
  const notifications = getNotifications();
  const filtered = notifications.filter(n => n.id !== id);
  saveNotifications(filtered);
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (): void => {
  saveNotifications([]);
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));
};

/**
 * Show push notification
 */
const showPushNotification = (notification: NotificationData): void => {
  if (!getPreferences().pushEnabled || Notification.permission !== 'granted') {
    return;
  }
  
  try {
    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon || '/favicon.svg',
      badge: notification.badge || '/favicon.svg',
      tag: notification.tag || 'ibedes',
      requireInteraction: notification.requireInteraction || false,
      data: notification.data
    };
    
    // Use service worker for notifications if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(notification.title, options);
      });
    } else {
      new Notification(notification.title, options);
    }
  } catch (error) {
    console.error('[Notifications] Failed to show push notification:', error);
  }
};

/**
 * Generate unique ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Check if notification is relevant to user preferences
 */
export const shouldShowNotification = (category: NotificationData['category']): boolean => {
  const prefs = getPreferences();
  
  switch (category) {
    case 'new_content':
      return prefs.newArticles;
    case 'engagement':
      return prefs.engagement;
    case 'system':
      return prefs.systemUpdates;
    case 'update':
      return true; // Always show important updates
    default:
      return true;
  }
};

/**
 * Create smart notifications based on user behavior
 */
export const createSmartNotifications = {
  // New article notification
  newArticle: (title: string, url: string, tags?: string[]) => {
    if (!shouldShowNotification('new_content')) return;
    
    addNotification({
      title: 'Artikel Baru: ' + title,
      body: `Artikel terbaru "${title}" sudah tersedia untuk dibaca.`,
      category: 'new_content',
      tag: 'new-article',
      data: { url, tags }
    });
  },
  
  // Weekly digest notification
  weeklyDigest: (stats: any) => {
    if (!shouldShowNotification('new_content') || !getPreferences().weeklyDigest) return;
    
    addNotification({
      title: 'Ringkasan Mingguan ibedes',
      body: `Dibaca ${stats.totalReads} artikel minggu ini. Lihat analisis lengkapnya!`,
      category: 'update',
      tag: 'weekly-digest',
      data: { stats }
    });
  },
  
  // Engagement notification
  milestone: (type: 'read100' | 'firstComment', data?: any) => {
    if (!shouldShowNotification('engagement')) return;
    
    const notifications = {
      read100: {
        title: '🎉 Pencapaian Hebat!',
        body: 'Anda telah membaca 100 artikel. Terima kasih telahjoin komunitas ibedes!'
      },
      firstComment: {
        title: '💬 Terima Kasih!',
        body: 'Komentar pertama Anda telah diterima. Diskusi yang bagus!'
      }
    };
    
    addNotification({
      ...notifications[type],
      category: 'engagement',
      tag: 'milestone',
      data
    });
  },
  
  // System update notification
  systemUpdate: (version: string, features: string[]) => {
    addNotification({
      title: `🔄 ibedes Update v${version}`,
      body: `Fitur baru: ${features.join(', ')}`,
      category: 'system',
      tag: 'system-update',
      data: { version, features }
    });
  }
};

/**
 * Setup periodic notifications
 */
export const setupPeriodicNotifications = (): void => {
  if (typeof window === 'undefined') return;
  
  // Check for new content every hour
  setInterval(() => {
    checkForNewContent();
  }, 60 * 60 * 1000);
  
  // Weekly digest every Monday at 9 AM
  setupWeeklyDigest();
};

/**
 * Check for new content
 */
const checkForNewContent = (): void => {
  // This would integrate with your content management system
  // For now, we'll simulate checking for new articles
  const lastCheck = localStorage.getItem('last_content_check');
  const now = Date.now();
  
  if (!lastCheck || (now - parseInt(lastCheck)) > 24 * 60 * 60 * 1000) {
    // Simulate finding a new article
    const articles = ['Menemukan Passion Sejati', 'Tips Produktivitas Remote', 'Kisah Sukses Pembelajaran'];
    const randomArticle = articles[Math.floor(Math.random() * articles.length)];
    
    createSmartNotifications.newArticle(randomArticle, '/blog/new-article');
    localStorage.setItem('last_content_check', now.toString());
  }
};

/**
 * Setup weekly digest
 */
const setupWeeklyDigest = (): void => {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
  nextMonday.setHours(9, 0, 0, 0);
  
  const timeUntilNextMonday = nextMonday.getTime() - now.getTime();
  
  setTimeout(() => {
    // Generate mock stats for weekly digest
    const stats = {
      totalReads: Math.floor(Math.random() * 50) + 10,
      topArticles: ['Artikel 1', 'Artikel 2', 'Artikel 3'],
      timeSpent: Math.floor(Math.random() * 300) + 60 // minutes
    };
    
    createSmartNotifications.weeklyDigest(stats);
    
    // Setup next week's digest
    setTimeout(setupWeeklyDigest, 7 * 24 * 60 * 60 * 1000);
  }, timeUntilNextMonday);
};

// Initialize periodic notifications on load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupPeriodicNotifications();
  });
}