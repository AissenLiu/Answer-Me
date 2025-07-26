'use client'

import { useEffect, useState } from 'react'

export function useVisitCounter() {
  const [visitCount, setVisitCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 获取当前访问次数
    const getVisitCount = () => {
      try {
        const stored = localStorage.getItem('answer-me-visit-count')
        return stored ? parseInt(stored, 10) : 0
      } catch (error) {
        console.warn('无法读取访问次数:', error)
        return 0
      }
    }

    // 更新访问次数
    const updateVisitCount = (count: number) => {
      try {
        localStorage.setItem('answer-me-visit-count', count.toString())
      } catch (error) {
        console.warn('无法保存访问次数:', error)
      }
    }

    // 检查是否是新会话
    const isNewSession = () => {
      const sessionKey = 'answer-me-session'
      const hasSession = sessionStorage.getItem(sessionKey)
      
      if (!hasSession) {
        sessionStorage.setItem(sessionKey, 'true')
        return true
      }
      return false
    }

    // 初始化访问计数
    const initVisitCounter = () => {
      const currentCount = getVisitCount()
      
      if (isNewSession()) {
        const newCount = currentCount + 1
        setVisitCount(newCount)
        updateVisitCount(newCount)
      } else {
        setVisitCount(currentCount)
      }
      
      setIsLoading(false)
    }

    initVisitCounter()
  }, [])

  return { visitCount, isLoading }
}