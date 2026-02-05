'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

interface Slide {
  id: number
  image: string
  headline: string
  subtitle: string
  ctaText: string
}

interface HeroSliderProps {
  slides: Slide[]
  additionalImages?: Slide[]
}

export default function HeroSlider({
  slides,
  additionalImages = [],
}: HeroSliderProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isShowingAdditional, setIsShowingAdditional] = useState(false)
  const [additionalIndex, setAdditionalIndex] = useState(0)
  const directionRef = useRef<1 | -1>(1) // 1 for forward, -1 for backward
  const frameRef = useRef(0)
  const imagesLoadedRef = useRef(false)
  
  // Animation configuration - memoized to prevent re-renders
  const totalFrames = slides.length
  const framesPerImage = 5
  const forwardFrameDuration = 100
  const reverseFrameDuration = useMemo(() => 6000 / totalFrames, [totalFrames])
  const forwardBaseDuration = useMemo(() => forwardFrameDuration / framesPerImage, [])
  const reverseBaseDuration = useMemo(() => reverseFrameDuration / framesPerImage, [reverseFrameDuration])
  
  
  // Preload all images with higher priority (frames + additional images)
  useEffect(() => {
    const allImages = [...slides, ...additionalImages]
    const imagePromises = allImages.map((slide) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.onload = resolve
        img.onerror = reject
        img.src = slide.image
        // Force image decoding for smoother transitions
        if ('decode' in img) {
          img.decode().then(resolve).catch(reject)
        }
      })
    })
    
    Promise.all(imagePromises)
      .then(() => {
        imagesLoadedRef.current = true
        // Ensure first frame is visible immediately
        setCurrentFrame(0)
      })
      .catch((err) => console.error('Error preloading images:', err))
  }, [slides, additionalImages])

  const goToNext = () => {
    if (additionalImages.length > 0) {
      if (isShowingAdditional) {
        // Cycle through additional images
        setAdditionalIndex((prev) => (prev + 1) % additionalImages.length)
      } else {
        // Switch to additional images
        setIsShowingAdditional(true)
        setAdditionalIndex(0)
      }
    }
  }

  const goToPrevious = () => {
    if (additionalImages.length > 0) {
      if (isShowingAdditional) {
        // Cycle through additional images backwards
        setAdditionalIndex((prev) => (prev - 1 + additionalImages.length) % additionalImages.length)
      } else {
        // Switch to additional images (start from last)
        setIsShowingAdditional(true)
        setAdditionalIndex(additionalImages.length - 1)
      }
    }
  }

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (additionalImages.length > 0) {
          if (isShowingAdditional) {
            setAdditionalIndex((prev) => (prev - 1 + additionalImages.length) % additionalImages.length)
          } else {
            setIsShowingAdditional(true)
            setAdditionalIndex(additionalImages.length - 1)
          }
        }
      } else if (e.key === 'ArrowRight') {
        if (additionalImages.length > 0) {
          if (isShowingAdditional) {
            setAdditionalIndex((prev) => (prev + 1) % additionalImages.length)
          } else {
            setIsShowingAdditional(true)
            setAdditionalIndex(0)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isShowingAdditional, additionalIndex, additionalImages.length])

  // Frame animation loop with reverse and variable speed (only when not showing additional images)
  useEffect(() => {
    // Pause animation when showing additional images
    if (isShowingAdditional) return
    
    let localCounter = 0
    let timeoutId: NodeJS.Timeout | null = null
    let startTimeoutId: NodeJS.Timeout | null = null
    
    // Wait for images to load before starting
    const checkAndStart = () => {
      if (!imagesLoadedRef.current) {
        startTimeoutId = setTimeout(checkAndStart, 50)
        return
      }
      
      const animate = () => {
        localCounter += 1
        
        if (localCounter >= framesPerImage) {
          const nextFrame = frameRef.current + directionRef.current
          
          // Reverse direction at boundaries
          if (nextFrame >= totalFrames - 1) {
            directionRef.current = -1
            frameRef.current = totalFrames - 1
          } else if (nextFrame <= 0) {
            directionRef.current = 1
            frameRef.current = 0
          } else {
            frameRef.current = nextFrame
          }
          
          setCurrentFrame(frameRef.current)
          localCounter = 0
        }
        
        // Use constant frame duration based on direction
        const isReversing = directionRef.current === -1
        const frameDuration = isReversing ? reverseBaseDuration : forwardBaseDuration
        
        timeoutId = setTimeout(animate, frameDuration)
      }

      // Start the animation (use forward duration initially)
      timeoutId = setTimeout(animate, forwardBaseDuration)
    }
    
    checkAndStart()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (startTimeoutId) clearTimeout(startTimeoutId)
    }
  }, [totalFrames, forwardBaseDuration, reverseBaseDuration, framesPerImage, isShowingAdditional])

  // Determine which image to show
  const currentImage = isShowingAdditional 
    ? additionalImages[additionalIndex] 
    : slides[currentFrame]

  // Minimalistic catchy phrase
  const catchyPhrase = 'Avril Lavigne'

  return (
    <section className="relative w-full h-screen overflow-hidden" aria-label="Hero slider">
      <img
        key={isShowingAdditional ? `additional-${additionalIndex}` : `frame-${currentFrame}`}
        src={currentImage?.image}
        alt={isShowingAdditional ? `Additional Image ${additionalIndex + 1}` : `Frame ${currentFrame + 1}`}
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
        loading="eager"
        style={{
          opacity: 1,
          transition: 'opacity 0.1s ease-in-out',
          transform: 'scale(1)',
          willChange: 'opacity',
        }}
        onDoubleClick={() => {
          // Double click to return to frame animation
          setIsShowingAdditional(false)
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Blur overlay for bottom right corner to hide watermark */}
      <div 
        className="absolute bottom-0 right-0 w-24 sm:w-24 md:w-24 h-24 sm:h-16 md:h-16 z-15"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 70%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Text Overlay - Right Side */}
      <div className="absolute right-0 top-16 sm:top-20 md:top-24 flex flex-col items-end pr-4 sm:pr-8 md:pr-12 lg:pr-16 xl:pr-24 z-20 px-4 sm:px-0">
        <div className="flex flex-col items-end gap-3 sm:gap-4">
          <div
            className="relative"
            style={{
              transform: 'rotate(-1deg)',
            }}
          >
            <div
              className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4"
              style={{
                border: '2px solid white',
                borderRadius: '6px',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.4)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(8px)',
                position: 'relative',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)',
                  borderRadius: '4px',
                }}
              />
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white relative z-10"
                style={{
                  letterSpacing: '2px',
                  lineHeight: '1.1',
                  textTransform: 'uppercase',
                  fontFamily: 'monospace',
                }}
              >
                Sk8er Boi
              </h1>
            </div>
          </div>
          <div
            className="relative"
            style={{
              transform: 'rotate(0.5deg)',
            }}
          >
            <div
              className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3"
              style={{
                border: '2px solid white',
                borderRadius: '5px',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.4)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(8px)',
                position: 'relative',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.08) 6px, rgba(255,255,255,0.08) 12px)',
                  borderRadius: '3px',
                }}
              />
              <p
                className="text-xs sm:text-sm md:text-base lg:text-lg text-white leading-tight relative z-10"
                style={{
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  fontFamily: 'monospace',
                }}
              >
                {catchyPhrase}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 text-white p-2 sm:p-3 md:p-4 transition-all duration-200 hover:opacity-80 active:opacity-60 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-full"
        aria-label="Previous slide"
        type="button"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
        >
          <path d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 text-white p-2 sm:p-3 md:p-4 transition-all duration-200 hover:opacity-80 active:opacity-60 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-full"
        aria-label="Next slide"
        type="button"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
        >
          <path d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {/* Social Media Icons - Bottom Left */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 z-30 flex flex-col gap-3 sm:gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-full p-2"
          aria-label="GitHub"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-full p-2"
          aria-label="LinkedIn"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-white/70 rounded-full p-2"
          aria-label="Instagram"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>
    </section>
  )
}
