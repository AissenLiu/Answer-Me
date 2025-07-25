'use client'

import { useState } from 'react'

interface SoundButtonProps {
  text: string
  audioSrc?: string
  onClick?: () => void
}

export default function SoundButton({ text, audioSrc, onClick }: SoundButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = async () => {
    setIsPressed(true)
    
    // 播放音频
    if (audioSrc) {
      try {
        const audio = new Audio(audioSrc)
        await audio.play()
      } catch (error) {
        console.error('音频播放失败:', error)
      }
    }
    
    // 调用外部点击处理函数
    if (onClick) {
      onClick()
    }
    
    // 重置按压状态
    setTimeout(() => {
      setIsPressed(false)
    }, 200)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        relative w-full aspect-square bg-white border-2 sm:border-4 border-gray-300 rounded-xl sm:rounded-2xl
        shadow-lg hover:shadow-xl transition-all duration-200
        flex items-center justify-center
        text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-700
        hover:bg-gray-50 active:bg-gray-100
        ${isPressed ? 'scale-95 shadow-md' : 'scale-100'}
        hover:scale-105 active:scale-95
        cursor-pointer select-none
        touch-manipulation
      `}
    >
      <span className="text-center px-2 sm:px-4 leading-tight break-words">
        {text}
      </span>
      
      {/* 按压效果 */}
      <div 
        className={`
          absolute inset-0 bg-black bg-opacity-10 rounded-xl sm:rounded-2xl
          transition-opacity duration-200
          ${isPressed ? 'opacity-100' : 'opacity-0'}
        `}
      />
    </button>
  )
}