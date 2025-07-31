'use client'

import SoundButton from '@/components/SoundButton'
import { useVisitCounter } from '@/hooks/useVisitCounter'

export default function Home() {
  const { visitCount, isLoading } = useVisitCounter()
  
  const buttons = [
    { id: 'answer-me', text: '回答我', audioSrc: '/audio/answer-me.mp3' },
    { id: 'look-in-eyes', text: 'look in my eyes', audioSrc: '/audio/look-in-my-eyes.mp3' },
    { id: 'tell-me-why', text: 'tell me why?', audioSrc: '/audio/tell-me-why.mp3' },
    { id: 'neng-neng-neng', text: '能能能', audioSrc: '/audio/neng-neng-neng.mp3' }
  ]

  const handleButtonClick = (buttonId: string) => {
    console.log(`点击了按钮: ${buttonId}`)
    // 这里可以添加额外的点击处理逻辑
  }

  return (
    <main className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
          最强嘴替
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          点击方块播放音频
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-sm sm:max-w-lg md:max-w-2xl">
        {buttons.map((button) => (
          <SoundButton
            key={button.id}
            text={button.text}
            audioSrc={button.audioSrc}
            onClick={() => handleButtonClick(button.id)}
          />
        ))}
      </div>
      
      <div className="mt-8 sm:mt-12 text-center text-gray-500 space-y-2">
        <p className="text-xs sm:text-sm">
          点击方块播放音频 🎵
        </p>
        <p className="text-xs text-gray-400">
          {isLoading ? (
            <span className="animate-pulse">加载中...</span>
          ) : (
            <span>访问次数: {visitCount.toLocaleString()}</span>
          )}
        </p>
      </div>
    </main>
  )
}