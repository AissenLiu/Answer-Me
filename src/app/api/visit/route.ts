import { NextRequest, NextResponse } from 'next/server'

// 使用内存存储访问次数（生产环境建议使用数据库）
let visitCount = 1000 // 设置初始访问次数

// 用于防止同一IP短时间内重复计数
const recentVisitors = new Map<string, number>()
const VISIT_COOLDOWN = 30 * 1000 // 30秒冷却时间

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
  // 返回当前访问次数
  return NextResponse.json({ 
    visitCount,
    message: 'success' 
  })
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const now = Date.now()
    
    // 检查是否在冷却时间内
    const lastVisit = recentVisitors.get(clientIP)
    if (lastVisit && (now - lastVisit) < VISIT_COOLDOWN) {
      // 在冷却时间内，不增加计数，但返回当前计数
      return NextResponse.json({ 
        visitCount,
        message: 'cooldown',
        cooldownTime: VISIT_COOLDOWN - (now - lastVisit)
      })
    }
    
    // 增加访问次数
    visitCount += 1
    
    // 记录访问时间
    recentVisitors.set(clientIP, now)
    
    // 清理过期的访问记录（每100次访问清理一次）
    if (visitCount % 100 === 0) {
      for (const [ip, time] of recentVisitors.entries()) {
        if (now - time > VISIT_COOLDOWN) {
          recentVisitors.delete(ip)
        }
      }
    }
    
    return NextResponse.json({ 
      visitCount,
      message: 'incremented',
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