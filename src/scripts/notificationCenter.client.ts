import { addNotification, clearAllNotifications, deleteNotification, markAllAsRead, markAsRead } from '../lib/notifications';

declare global {
  interface Window {
    markAsRead?: (id: string) => void;
    markAllAsRead?: () => void;
    deleteNotification?: (id: string) => void;
    clearAllNotifications?: () => void;
    testNotification?: () => void;
  }
}

const ensureHandlers = () => {
  window.markAsRead = (id: string) => {
    if (typeof id === 'string' && id) {
      markAsRead(id);
    }
  };

  window.markAllAsRead = () => {
    markAllAsRead();
  };

  window.deleteNotification = (id: string) => {
    if (typeof id === 'string' && id) {
      deleteNotification(id);
    }
  };

  window.clearAllNotifications = () => {
    clearAllNotifications();
  };

  window.testNotification = () => {
    addNotification({
      title: 'Contoh Notifikasi',
      body: 'Ini hanyalah pesan percobaan untuk mengetes alur notifikasi.',
      category: 'system',
      tag: 'test',
      data: { source: 'notification-center' }
    });
  };
};

if (typeof window !== 'undefined') {
  ensureHandlers();
}
