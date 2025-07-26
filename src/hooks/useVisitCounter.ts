'use client'

import { useEffect, useState } from 'react'

export function useVisitCounter() {
  const [visitCount, setVisitCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let hasCountedThisSession = false

    // 获取当前全站访问次数
    const fetchVisitCount = async () => {
      try {
        const response = await fetch('/api/visit', {
          method: 'GET',
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          setVisitCount(data.visitCount)
        } else {
          console.error('获取访问次数失败')
          setVisitCount(0)
        }
      } catch (error) {
        console.error('访问计数API调用失败:', error)
        setVisitCount(0)
      }
    }

    // 增加访问次数（新用户访问）
    const incrementVisitCount = async () => {
      try {
        const response = await fetch('/api/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setVisitCount(data.visitCount)
          console.log('访问统计:', data.message)
        } else {
          console.error('增加访问次数失败')
        }
      } catch (error) {
        console.error('访问计数API调用失败:', error)
        // 发生错误时，仍然获取当前计数
        await fetchVisitCount()
      }
    }

    // 检查是否是新会话
    const isNewSession = () => {
      const sessionKey = 'answer-me-global-session'
      const hasSession = sessionStorage.getItem(sessionKey)
      
      if (!hasSession) {
        sessionStorage.setItem(sessionKey, Date.now().toString())
        return true
      }
      return false
    }

    // 初始化访问计数
    const initVisitCounter = async () => {
      if (isNewSession() && !hasCountedThisSession) {
        hasCountedThisSession = true
        // 新会话，增加全站访问次数
        await incrementVisitCount()
      } else {
        // 已有会话，只获取当前计数
        await fetchVisitCount()
      }
      
      setIsLoading(false)
    }

    initVisitCounter()
  }, [])

  return { visitCount, isLoading }
}