'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { decodeGameData } from '../utils/encode'
import styles from './page.module.css'

function GameContent() {
  const searchParams = useSearchParams()
  const [gameData, setGameData] = useState({
    name: '',
    question: '',
    theme: 'love',
    yesText: 'Yes!',
    noText: 'No'
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [celebrationStage, setCelebrationStage] = useState(0)
  const noButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const mobileRegex = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i
      const isMobileDevice = mobileRegex.test(navigator.userAgent) || 
                            (window.innerWidth <= 768 && window.innerHeight <= 1024)
      setIsMobile(isMobileDevice)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Try to decode from new short URL format first
    const encoded = searchParams.get('v')
    if (encoded) {
      const decoded = decodeGameData(encoded)
      if (decoded) {
        setGameData(decoded)
        return
      }
    }
    
    // Fallback to old query parameter format for backward compatibility
    const name = searchParams.get('name') || ''
    const question = searchParams.get('question') || 'Will be my valentine?'
    const theme = searchParams.get('theme') || 'love'
    const yesText = searchParams.get('yesText') || 'Yes!'
    const noText = searchParams.get('noText') || 'No'

    setGameData({ name, question, theme, yesText, noText })
  }, [searchParams])

  useEffect(() => {
    const noButton = noButtonRef.current
    if (!noButton) return

    // Set initial position for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      const maxX = window.innerWidth - noButton.offsetWidth - 40
      const maxY = window.innerHeight - noButton.offsetHeight - 40
      const initialX = Math.max(40, Math.random() * maxX)
      const initialY = Math.max(40, Math.random() * maxY)
      noButton.style.position = 'fixed'
      noButton.style.left = `${initialX}px`
      noButton.style.top = `${initialY}px`
    }

    const moveButtonAway = (touchX: number, touchY: number) => {
      const rect = noButton.getBoundingClientRect()
      const buttonCenterX = rect.left + rect.width / 2
      const buttonCenterY = rect.top + rect.height / 2
      
      const maxX = window.innerWidth - noButton.offsetWidth - 40
      const maxY = window.innerHeight - noButton.offsetHeight - 40
      
      // Calculate new position away from touch point
      const angle = Math.atan2(touchY - buttonCenterY, touchX - buttonCenterX)
      const newX = Math.max(40, Math.min(maxX, buttonCenterX + Math.cos(angle + Math.PI) * 200))
      const newY = Math.max(40, Math.min(maxY, buttonCenterY + Math.sin(angle + Math.PI) * 200))
      
      noButton.style.position = 'fixed'
      noButton.style.left = `${newX - rect.width / 2}px`
      noButton.style.top = `${newY - rect.height / 2}px`
      noButton.style.transition = 'all 0.2s ease-out'
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = noButton.getBoundingClientRect()
      const buttonCenterX = rect.left + rect.width / 2
      const buttonCenterY = rect.top + rect.height / 2
      const mouseX = e.clientX
      const mouseY = e.clientY
      
      // Calculate distance from mouse to button center
      const distance = Math.sqrt(
        Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
      )
      
      // If mouse is close to button, move it away
      if (distance < 150) {
        moveButtonAway(mouseX, mouseY)
      }
    }

    const handleMouseEnter = () => {
      const maxX = window.innerWidth - noButton.offsetWidth - 40
      const maxY = window.innerHeight - noButton.offsetHeight - 40
      
      const randomX = Math.max(40, Math.random() * maxX)
      const randomY = Math.max(40, Math.random() * maxY)
      
      noButton.style.position = 'fixed'
      noButton.style.left = `${randomX}px`
      noButton.style.top = `${randomY}px`
      noButton.style.transition = 'all 0.2s ease-out'
    }

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const rect = noButton.getBoundingClientRect()
      const buttonCenterX = rect.left + rect.width / 2
      const buttonCenterY = rect.top + rect.height / 2
      const touchX = touch.clientX
      const touchY = touch.clientY
      
      // Calculate distance from touch to button center
      const distance = Math.sqrt(
        Math.pow(touchX - buttonCenterX, 2) + Math.pow(touchY - buttonCenterY, 2)
      )
      
      // If touch is close to button, move it away immediately
      if (distance < 200) {
        e.preventDefault() // Prevent click
        moveButtonAway(touchX, touchY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const rect = noButton.getBoundingClientRect()
      const buttonCenterX = rect.left + rect.width / 2
      const buttonCenterY = rect.top + rect.height / 2
      const touchX = touch.clientX
      const touchY = touch.clientY
      
      // Calculate distance from touch to button center
      const distance = Math.sqrt(
        Math.pow(touchX - buttonCenterX, 2) + Math.pow(touchY - buttonCenterY, 2)
      )
      
      // If touch is close to button, move it away
      if (distance < 200) {
        e.preventDefault() // Prevent click
        moveButtonAway(touchX, touchY)
      }
    }

    // Desktop events
    window.addEventListener('mousemove', handleMouseMove)
    noButton.addEventListener('mouseenter', handleMouseEnter)
    
    // Mobile touch events
    noButton.addEventListener('touchstart', handleTouchStart, { passive: false })
    noButton.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      noButton.removeEventListener('mouseenter', handleMouseEnter)
      noButton.removeEventListener('touchstart', handleTouchStart)
      noButton.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const handleYesClick = () => {
    setShowCelebration(true)
    // Animate through different celebration stages
    setTimeout(() => setCelebrationStage(1), 1000)
    setTimeout(() => setCelebrationStage(2), 2500)
    setTimeout(() => setCelebrationStage(3), 4000)
  }

  const getThemeClass = () => {
    return styles[`theme${gameData.theme.charAt(0).toUpperCase() + gameData.theme.slice(1)}`]
  }

  // Show mobile message if on mobile
  if (isMobile) {
    return (
      <div className={styles.container}>
        <div className={styles.stars}></div>
        <div className={styles.mobileMessage}>
          <div className={styles.mobileIcon}>📱➡️💻</div>
          <h1 className={styles.mobileTitle}>Oops! This game needs a laptop! 🖥️</h1>
          <p className={styles.mobileText}>
            This interactive experience works best on a desktop or laptop computer.
          </p>
          <p className={styles.mobileSubtext}>
            Please open this link on your laptop or desktop to experience the full fun! 😊
          </p>
          <div className={styles.mobileEmoji}>💕✨🎉</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.container} ${getThemeClass()}`}>
      <div className={styles.stars}></div>
      <div className={styles.gameContent}>
        <div className={styles.questionDisplay}>
          {gameData.name ? `${gameData.name} ${gameData.question}` : gameData.question}
        </div>
        
        <div className={styles.buttonsContainer}>
          <button
            onClick={handleYesClick}
            className={styles.btnYes}
          >
            {gameData.yesText}
          </button>
          <button
            ref={noButtonRef}
            className={styles.btnNo}
          >
            {gameData.noText}
          </button>
        </div>
        
        {showCelebration && (
          <div className={styles.celebration}>
            <div className={styles.confetti}>
              {[...Array(50)].map((_, i) => {
                const left = Math.random() * 100
                const delay = Math.random() * 2
                const duration = 2 + Math.random() * 2
                const colors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0080']
                const color = colors[Math.floor(Math.random() * colors.length)]
                const size = 8 + Math.random() * 8
                return (
                  <div
                    key={i}
                    className={styles.confettiPiece}
                    style={{
                      left: `${left}%`,
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                      background: color,
                      width: `${size}px`,
                      height: `${size}px`
                    }}
                  ></div>
                )
              })}
            </div>
            
            {/* Dancing GIF-like animation */}
            {/* <div className={styles.dancingContainer}>
              <div className={styles.dancingEmoji}>🎉</div>
              <div className={styles.dancingEmoji}>💃</div>
              <div className={styles.dancingEmoji}>🕺</div>
              <div className={styles.dancingEmoji}>🎊</div>
            </div> */}

            {/* Stage 0: Initial celebration */}
            {celebrationStage === 0 && (
              <h2 className={styles.celebrationText}>
                Yay! You said Yes! 🎉💕
              </h2>
            )}

            {/* Stage 1: I knew it! */}
            {celebrationStage >= 1 && (
              <div className={styles.knewItContainer}>
                <div className={styles.knewItImageWrapper}>
                  <img
                    src="/i-knew-it.png"
                    alt="I Knew It!"
                    className={styles.knewItImage}
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      const target = e.target as HTMLImageElement
                      target.src = '/i-knew-it-placeholder.svg'
                    }}
                  />
                </div>
                <div className={styles.winkEmoji}>😉</div>
              </div>
            )}

            {/* Stage 2: Funny message */}
            {celebrationStage >= 2 && (
              <div className={styles.funnyMessage}>
                <p className={styles.funnyText}>
                  You never had a choice anyway! 😂
                </p>
                <div className={styles.smugEmoji}>😎</div>
              </div>
            )}

            {/* Stage 3: Final celebration */}
            {celebrationStage >= 3 && (
              <div className={styles.finalMessage}>
                <p className={styles.finalText}>
                  This is going to be amazing! 🚀💖
                </p>
              </div>
            )}

            <div className={styles.hearts}>
              {[...Array(20)].map((_, i) => {
                const left = Math.random() * 100
                const delay = Math.random() * 3
                const duration = 3 + Math.random() * 2
                const emojis = ['💕', '💖', '💗', '💝', '💘', '💞', '💓', '💟']
                const emoji = emojis[Math.floor(Math.random() * emojis.length)]
                return (
                  <div
                    key={i}
                    className={styles.heart}
                    style={{
                      left: `${left}%`,
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`
                    }}
                  >
                    {emoji}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.stars}></div>
        <div className={styles.gameContent}>
          <div className={styles.questionDisplay}>Loading...</div>
        </div>
      </div>
    }>
      <GameContent />
    </Suspense>
  )
}

