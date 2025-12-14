import api from './api';

const PUBLIC_VAPID_KEY = 'BI7bigXd2j06EY9gyEYpKHuKCjfLZGLyzsbde83_xgpwa5mY32mIpfREBS5uWebPvR0Y4iFE8Xw4wyEPyjDP2gc';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const register = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('Service Worker registered');
      return register;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    console.warn('Push notifications not supported');
    return null;
  }
};

export const subscribeToPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
        // Optional: Send to backend to ensure it's synced
        await sendSubscriptionToBackend(existingSubscription);
        return existingSubscription;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    await sendSubscriptionToBackend(subscription);
    console.log('Push Notification Subscribed');
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }
};

const sendSubscriptionToBackend = async (subscription) => {
  try {
    await api.post('/push/subscribe', subscription);
  } catch (error) {
    console.error('Error sending subscription to backend:', error);
  }
};

export const unsubscribeFromPushNotifications = async () => {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
            console.log('Unsubscribed from push notifications');
        }
    } catch (error) {
        console.error('Error unsubscribing:', error);
    }
};
