import Redis from 'ioredis'

let redis: Redis

if (process.env.REDIS_REDIS_URL) {
  // Vercel Redis连接
  redis = new Redis(process.env.REDIS_REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  })
} else {
  // 开发环境或无Redis时的备用
  console.warn('Redis URL not configured, using memory storage')
  redis = null as any
}

// Redis连接事件监听
if (redis) {
  redis.on('connect', () => {
    console.log('Redis connected successfully')
  })

  redis.on('error', (err) => {
    console.error('Redis connection error:', err)
  })

  redis.on('ready', () => {
    console.log('Redis is ready to receive commands')
  })
}

export { redis }

// Redis操作封装
export class VisitCounter {
  private static readonly VISIT_COUNT_KEY = 'answer-me:visit-count'
  private static readonly RECENT_VISITORS_KEY = 'answer-me:recent-visitors'
  private static readonly COOLDOWN_SECONDS = 30

  // 获取访问次数
  static async getVisitCount(): Promise<number> {
    if (!redis) {
      return 1000 // 无Redis时返回默认值
    }
    
    try {
      const count = await redis.get(this.VISIT_COUNT_KEY)
      return count ? parseInt(count, 10) : 1000
    } catch (error) {
      console.error('Redis get visit count error:', error)
      return 1000
    }
  }

  // 增加访问次数
  static async incrementVisitCount(): Promise<number> {
    if (!redis) {
      return 1001 // 无Redis时返回默认值
    }

    try {
      const newCount = await redis.incr(this.VISIT_COUNT_KEY)
      return newCount
    } catch (error) {
      console.error('Redis increment visit count error:', error)
      return await this.getVisitCount()
    }
  }

  // 检查IP是否在冷却期
  static async isInCooldown(ip: string): Promise<boolean> {
    if (!redis) {
      return false // 无Redis时不限制
    }

    try {
      const lastVisit = await redis.hget(this.RECENT_VISITORS_KEY, ip)
      if (!lastVisit) {
        return false
      }

      const timeDiff = Date.now() - parseInt(lastVisit, 10)
      return timeDiff < this.COOLDOWN_SECONDS * 1000
    } catch (error) {
      console.error('Redis cooldown check error:', error)
      return false
    }
  }

  // 记录访问时间
  static async recordVisit(ip: string): Promise<void> {
    if (!redis) {
      return // 无Redis时跳过
    }

    try {
      const now = Date.now().toString()
      await redis.hset(this.RECENT_VISITORS_KEY, ip, now)
      
      // 设置过期时间，定期清理
      await redis.expire(this.RECENT_VISITORS_KEY, this.COOLDOWN_SECONDS * 2)
    } catch (error) {
      console.error('Redis record visit error:', error)
    }
  }

  // 清理过期访问记录
  static async cleanupExpiredVisitors(): Promise<void> {
    if (!redis) {
      return
    }

    try {
      const now = Date.now()
      const visitors = await redis.hgetall(this.RECENT_VISITORS_KEY)
      
      const toDelete: string[] = []
      Object.entries(visitors).forEach(([ip, time]) => {
        if (now - parseInt(time, 10) > this.COOLDOWN_SECONDS * 1000) {
          toDelete.push(ip)
        }
      })

      if (toDelete.length > 0) {
        await redis.hdel(this.RECENT_VISITORS_KEY, ...toDelete)
      }
    } catch (error) {
      console.error('Redis cleanup error:', error)
    }
  }
}