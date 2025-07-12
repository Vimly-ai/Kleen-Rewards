/**
 * Advanced Service Worker for Employee Rewards PWA
 * Features: Multiple caching strategies, offline support, background sync, push notifications
 */

const CACHE_VERSION = 'v2.0.0'
const STATIC_CACHE = `employee-rewards-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `employee-rewards-dynamic-${CACHE_VERSION}`
const API_CACHE = `employee-rewards-api-${CACHE_VERSION}`
const IMAGE_CACHE = `employee-rewards-images-${CACHE_VERSION}`

// Cache configurations
const CACHE_CONFIG = {
  static: {
    name: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },
  dynamic: {
    name: DYNAMIC_CACHE,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 50
  },
  api: {
    name: API_CACHE,
    maxAge: 60 * 60 * 1000, // 1 hour
    maxEntries: 100
  },
  images: {
    name: IMAGE_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  }
}

// URLs to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html'
]

// Network patterns for different caching strategies
const CACHE_PATTERNS = {
  // Cache first (for static assets)
  cacheFirst: [
    /\.(?:js|css|woff2?|eot|ttf|otf)$/,
    /\/static\//,
    /\/assets\//
  ],
  
  // Network first (for dynamic content)
  networkFirst: [
    /\/api\//,
    /\/auth\//,
    /\/dashboard/,
    /\/profile/
  ],
  
  // Stale while revalidate (for semi-dynamic content)
  staleWhileRevalidate: [
    /\/rewards/,
    /\/leaderboard/,
    /\/achievements/
  ],
  
  // Images
  images: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/
  ]
}

// Background sync tags
const SYNC_TAGS = {
  CHECK_IN: 'check-in-sync',
  POINTS_UPDATE: 'points-update-sync',
  PROFILE_UPDATE: 'profile-update-sync',
  REWARD_CLAIM: 'reward-claim-sync'
}

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName.includes('employee-rewards') && 
                !Object.values(CACHE_CONFIG).some(config => config.name === cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      
      // Claim all clients
      self.clients.claim()
    ])
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }
  
  // Determine caching strategy based on URL patterns
  if (matchesPattern(request.url, CACHE_PATTERNS.images)) {
    event.respondWith(handleImageRequest(request))
  } else if (matchesPattern(request.url, CACHE_PATTERNS.cacheFirst)) {
    event.respondWith(handleCacheFirst(request))
  } else if (matchesPattern(request.url, CACHE_PATTERNS.networkFirst)) {
    event.respondWith(handleNetworkFirst(request))
  } else if (matchesPattern(request.url, CACHE_PATTERNS.staleWhileRevalidate)) {
    event.respondWith(handleStaleWhileRevalidate(request))
  } else {
    // Default to network first
    event.respondWith(handleNetworkFirst(request))
  }
})

// Push notification handler
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event)
  
  let notificationData = {
    title: 'Employee Rewards',
    body: 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'default',
    data: {}
  }
  
  if (event.data) {
    try {
      const payload = event.data.json()
      notificationData = { ...notificationData, ...payload }
    } catch (error) {
      console.warn('[SW] Failed to parse push data:', error)
      notificationData.body = event.data.text()
    }
  }
  
  // Customize notification based on type
  const options = createNotificationOptions(notificationData)
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event)
  
  event.notification.close()
  
  const { action, notification } = event
  const data = notification.data || {}
  
  event.waitUntil(
    handleNotificationClick(action, data)
  )
})

// Background sync handler
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  switch (event.tag) {
    case SYNC_TAGS.CHECK_IN:
      event.waitUntil(syncCheckIns())
      break
    case SYNC_TAGS.POINTS_UPDATE:
      event.waitUntil(syncPointsUpdates())
      break
    case SYNC_TAGS.PROFILE_UPDATE:
      event.waitUntil(syncProfileUpdates())
      break
    case SYNC_TAGS.REWARD_CLAIM:
      event.waitUntil(syncRewardClaims())
      break
    default:
      console.log('[SW] Unknown sync tag:', event.tag)
  }
})

// Message handler for communication with main thread
self.addEventListener('message', event => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_VERSION })
      break
    case 'CLEAR_CACHE':
      clearCaches().then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
    case 'CACHE_URLS':
      cacheUrls(payload.urls).then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
    default:
      console.log('[SW] Unknown message type:', type)
  }
})

// Helper functions

function matchesPattern(url, patterns) {
  return patterns.some(pattern => pattern.test(url))
}

async function handleCacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.warn('[SW] Cache first failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.warn('[SW] Network first fallback to cache:', error)
    
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline.html')
      if (offlineResponse) {
        return offlineResponse
      }
    }
    
    return new Response('Offline', { status: 503 })
  }
}

async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE)
  const cachedResponse = await cache.match(request)
  
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(error => {
    console.warn('[SW] Stale while revalidate network error:', error)
  })
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Otherwise wait for network
  return networkResponsePromise || new Response('Offline', { status: 503 })
}

async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.warn('[SW] Image request failed:', error)
    // Return placeholder image or offline indicator
    return new Response('', { status: 503 })
  }
}

function createNotificationOptions(data) {
  const baseOptions = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || 'default',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    vibrate: data.vibrate || [100, 50, 100]
  }
  
  // Add actions based on notification type
  if (data.type === 'achievement') {
    baseOptions.actions = [
      {
        action: 'view_achievement',
        title: 'View Achievement',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-192.png'
      }
    ]
  } else if (data.type === 'reward') {
    baseOptions.actions = [
      {
        action: 'view_rewards',
        title: 'View Rewards',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-192.png'
      }
    ]
  } else if (data.type === 'checkin_reminder') {
    baseOptions.actions = [
      {
        action: 'quick_checkin',
        title: 'Check In Now',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Later',
        icon: '/icon-192.png'
      }
    ]
  } else {
    baseOptions.actions = [
      {
        action: 'open_app',
        title: 'Open App',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-192.png'
      }
    ]
  }
  
  return baseOptions
}

async function handleNotificationClick(action, data) {
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  
  const urls = {
    view_achievement: '/employee/achievements',
    view_rewards: '/employee/rewards',
    quick_checkin: '/employee/dashboard',
    open_app: data.url || '/'
  }
  
  if (action === 'dismiss') {
    return
  }
  
  const url = urls[action] || '/'
  
  // Focus existing window or open new one
  for (const client of clients) {
    if (client.url.includes(url) && 'focus' in client) {
      return client.focus()
    }
  }
  
  if (self.clients.openWindow) {
    return self.clients.openWindow(url)
  }
}

// Background sync functions
async function syncCheckIns() {
  try {
    const pendingCheckIns = await getStoredData('pending_checkins')
    
    for (const checkIn of pendingCheckIns || []) {
      try {
        const response = await fetch('/api/checkins', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(checkIn)
        })
        
        if (response.ok) {
          await removeStoredData('pending_checkins', checkIn.id)
          console.log('[SW] Synced check-in:', checkIn.id)
        }
      } catch (error) {
        console.warn('[SW] Failed to sync check-in:', error)
      }
    }
  } catch (error) {
    console.error('[SW] Check-in sync failed:', error)
  }
}

async function syncPointsUpdates() {
  // Implement points updates sync
  console.log('[SW] Syncing points updates...')
}

async function syncProfileUpdates() {
  // Implement profile updates sync
  console.log('[SW] Syncing profile updates...')
}

async function syncRewardClaims() {
  // Implement reward claims sync
  console.log('[SW] Syncing reward claims...')
}

// Storage helpers
async function getStoredData(key) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const response = await cache.match(`/sw-storage/${key}`)
    if (response) {
      return await response.json()
    }
  } catch (error) {
    console.warn('[SW] Failed to get stored data:', error)
  }
  return null
}

async function setStoredData(key, data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const response = new Response(JSON.stringify(data))
    await cache.put(`/sw-storage/${key}`, response)
  } catch (error) {
    console.warn('[SW] Failed to set stored data:', error)
  }
}

async function removeStoredData(key, itemId) {
  try {
    const data = await getStoredData(key)
    if (data && Array.isArray(data)) {
      const filtered = data.filter(item => item.id !== itemId)
      await setStoredData(key, filtered)
    }
  } catch (error) {
    console.warn('[SW] Failed to remove stored data:', error)
  }
}

async function clearCaches() {
  const cacheNames = await caches.keys()
  return Promise.all(
    cacheNames.map(name => caches.delete(name))
  )
}

async function cacheUrls(urls) {
  const cache = await caches.open(STATIC_CACHE)
  return cache.addAll(urls)
}

// Cleanup old cache entries
async function cleanupCache(cacheName, maxEntries, maxAge) {
  const cache = await caches.open(cacheName)
  const requests = await cache.keys()
  
  // Remove old entries
  const now = Date.now()
  for (const request of requests) {
    const response = await cache.match(request)
    const dateHeader = response.headers.get('date')
    
    if (dateHeader) {
      const age = now - new Date(dateHeader).getTime()
      if (age > maxAge) {
        await cache.delete(request)
      }
    }
  }
  
  // Remove excess entries
  const remainingRequests = await cache.keys()
  if (remainingRequests.length > maxEntries) {
    const toDelete = remainingRequests.slice(maxEntries)
    for (const request of toDelete) {
      await cache.delete(request)
    }
  }
}

// Periodic cleanup
setInterval(() => {
  Object.values(CACHE_CONFIG).forEach(config => {
    cleanupCache(config.name, config.maxEntries, config.maxAge)
  })
}, 24 * 60 * 60 * 1000) // Daily cleanup

console.log('[SW] Service worker loaded successfully')