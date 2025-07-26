import { NextRequest, NextResponse } from 'next/server'
import { VisitCounter } from '@/lib/redis'

function getClientIP(request: NextRequest): string {
  // 获取真实IP地址
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function GET() {
  try {
    // 从Redis获取当前访问次数
    const visitCount = await VisitCounter.getVisitCount()
    
    return NextResponse.json({ 
      visitCount,
      message: 'success',
      source: 'redis'
    })
  } catch (error) {
    console.error('获取访问次数API错误:', error)
    return NextResponse.json(
      { error: '获取访问次数失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    
    // 检查是否在冷却时间内
    const isInCooldown = await VisitCounter.isInCooldown(clientIP)
    if (isInCooldown) {
      // 在冷却时间内，不增加计数，返回当前计数
      const visitCount = await VisitCounter.getVisitCount()
      return NextResponse.json({ 
        visitCount,
        message: 'cooldown',
        source: 'redis'
      })
    }
    
    // 增加访问次数
    const visitCount = await VisitCounter.incrementVisitCount()
    
    // 记录访问时间
    await VisitCounter.recordVisit(clientIP)
    
    // 定期清理过期记录（每100次访问清理一次）
    if (visitCount % 100 === 0) {
      await VisitCounter.cleanupExpiredVisitors()
    }
    
    return NextResponse.json({ 
      visitCount,
      message: 'incremented',
      source: 'redis',
      clientIP: clientIP.replace(/\d+$/, 'xxx') // 隐私保护，隐藏IP最后部分
    })
    
  } catch (error) {
    console.error('访问统计API错误:', error)
    return NextResponse.json(
      { error: '统计访问次数失败' },
      { status: 500 }
    )
  }
}