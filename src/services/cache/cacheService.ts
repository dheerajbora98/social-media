import AsyncStorage from "@react-native-async-storage/async-storage"

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresIn: number
}

class CacheService {
  private static instance: CacheService
  private cache: Map<string, any> = new Map()

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  async set<T>(key: string, data: T, expiresIn = 300000): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    }

    // Store in memory
    this.cache.set(key, cacheItem)

    // Store in AsyncStorage for persistence
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem))
    } catch (error) {
      console.error("Failed to cache data:", error)
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    let cacheItem = this.cache.get(key)

    // If not in memory, check AsyncStorage
    if (!cacheItem) {
      try {
        const stored = await AsyncStorage.getItem(`cache_${key}`)
        if (stored) {
          cacheItem = JSON.parse(stored)
          this.cache.set(key, cacheItem)
        }
      } catch (error) {
        console.error("Failed to retrieve cached data:", error)
        return null
      }
    }

    if (!cacheItem) {
      return null
    }

    // Check if cache has expired
    const now = Date.now()
    if (now - cacheItem.timestamp > cacheItem.expiresIn) {
      await this.remove(key)
      return null
    }

    return cacheItem.data
  }

  async remove(key: string): Promise<void> {
    this.cache.delete(key)
    try {
      await AsyncStorage.removeItem(`cache_${key}`)
    } catch (error) {
      console.error("Failed to remove cached data:", error)
    }
  }

  async clear(): Promise<void> {
    this.cache.clear()
    try {
      const keys = await AsyncStorage.getAllKeys()
      const cacheKeys = keys.filter((key) => key.startsWith("cache_"))
      await AsyncStorage.multiRemove(cacheKeys)
    } catch (error) {
      console.error("Failed to clear cache:", error)
    }
  }

  async getSize(): Promise<number> {
    return this.cache.size
  }
}

export const cacheService = CacheService.getInstance()
