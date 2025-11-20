/**
 * PWA Utilities for NorCal CARB Portal
 * Handles push notifications, background sync, and service worker management
 */

// =====================================================
// PUSH NOTIFICATIONS
// =====================================================

export interface PushNotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

/**
 * Request permission for push notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Push notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Subscribe to push notifications (requires Firebase Cloud Messaging)
 */
export async function subscribeToPushNotifications(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    });

    console.log('Push subscription:', subscription);
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
}

/**
 * Get current push subscription
 */
export async function getPushSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting push subscription:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const subscription = await getPushSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

/**
 * Show a local notification (doesn't require server push)
 */
export async function showLocalNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  try {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

// =====================================================
// BACKGROUND SYNC
// =====================================================

/**
 * Register a background sync task
 */
export async function registerBackgroundSync(tag: string): Promise<boolean> {
  try {
    if (!('sync' in ServiceWorkerRegistration.prototype)) {
      console.warn('Background sync not supported');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register(tag);
    console.log('Background sync registered:', tag);
    return true;
  } catch (error) {
    console.error('Error registering background sync:', error);
    return false;
  }
}

/**
 * Register periodic background sync (experimental)
 */
export async function registerPeriodicSync(
  tag: string,
  minInterval: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<boolean> {
  try {
    if (!('periodicSync' in ServiceWorkerRegistration.prototype)) {
      console.warn('Periodic background sync not supported');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    await (registration as any).periodicSync.register(tag, {
      minInterval,
    });
    console.log('Periodic sync registered:', tag);
    return true;
  } catch (error) {
    console.error('Error registering periodic sync:', error);
    return false;
  }
}

// =====================================================
// SERVICE WORKER MANAGEMENT
// =====================================================

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(
  scriptURL: string = '/sw.js'
): Promise<ServiceWorkerRegistration | null> {
  if (!isServiceWorkerSupported()) {
    console.warn('Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(scriptURL);
    console.log('Service worker registered:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('New service worker found');

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker installed, update available');
            // Optionally show update notification to user
            showUpdateNotification();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
}

/**
 * Update service worker
 */
export async function updateServiceWorker(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    console.log('Service worker updated');
  } catch (error) {
    console.error('Error updating service worker:', error);
  }
}

/**
 * Skip waiting and activate new service worker
 */
export async function skipWaitingAndActivate(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // Reload page to use new service worker
      window.location.reload();
    }
  } catch (error) {
    console.error('Error activating service worker:', error);
  }
}

/**
 * Clear all service worker caches
 */
export async function clearAllCaches(): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({ type: 'CLEAR_CACHE' });
    }
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
}

/**
 * Show notification when service worker update is available
 */
function showUpdateNotification() {
  // This can be customized with your UI framework
  console.log('App update available');

  // Optional: Show a toast notification
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('sw-update-available');
    window.dispatchEvent(event);
  }
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if app is installed (standalone mode)
 */
export function isInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // Check for iOS standalone
  const isIOSStandalone = (window.navigator as any).standalone === true;

  return isStandalone || isIOSStandalone;
}

/**
 * Check if device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Check if device is Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * Get device type
 */
export function getDeviceType(): 'ios' | 'android' | 'desktop' | 'unknown' {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  if (/Windows|Mac|Linux/.test(navigator.userAgent)) return 'desktop';
  return 'unknown';
}
