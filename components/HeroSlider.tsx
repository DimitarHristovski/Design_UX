'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

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
  
  // Calculate speed multiplier based on frame position (faster at edges) - memoized
  const getSpeedMultiplier = useCallback((frame: number): number => {
    // Normalize frame position (0 to 1)
    const normalized = frame / (totalFrames - 1)
    
    // Create a curve that's faster at the edges (0 and 1) and slower in the middle (0.5)
    // Using a quadratic curve: 1 - 4 * (x - 0.5)^2
    // This gives: 1 at edges (0 and 1), 0 at middle (0.5)
    // We'll invert it and scale it: faster = lower multiplier
    const curve = 1 - 4 * Math.pow(normalized - 0.5, 2)
    
    // Map curve (0 to 1) to speed multiplier (0.3 to 1.0)
    // 0.3 = 3x faster at edges, 1.0 = normal speed in middle
    return 0.3 + (curve * 0.7)
  }, [totalFrames])
  
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
        
        // Calculate dynamic frame duration based on direction and frame position
        const isReversing = directionRef.current === -1
        const baseDuration = isReversing ? reverseBaseDuration : forwardBaseDuration
        const speedMultiplier = getSpeedMultiplier(frameRef.current)
        const dynamicFrameDuration = baseDuration * speedMultiplier
        
        timeoutId = setTimeout(animate, dynamicFrameDuration)
      }

      // Start the animation (use forward duration initially)
      timeoutId = setTimeout(animate, forwardBaseDuration)
    }
    
    checkAndStart()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (startTimeoutId) clearTimeout(startTimeoutId)
    }
  }, [totalFrames, forwardBaseDuration, reverseBaseDuration, framesPerImage, getSpeedMultiplier, isShowingAdditional])

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

  // Determine which image to show
  const currentImage = isShowingAdditional 
    ? additionalImages[additionalIndex] 
    : slides[currentFrame]

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <img
        key={isShowingAdditional ? `additional-${additionalIndex}` : `frame-${currentFrame}`}
        src={currentImage?.image}
        alt={isShowingAdditional ? `Additional Image ${additionalIndex + 1}` : `Frame ${currentFrame + 1}`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="eager"
        style={{
          opacity: 1,
          transition: 'opacity 0.08s linear',
        }}
        onDoubleClick={() => {
          // Double click to return to frame animation
          setIsShowingAdditional(false)
        }}
      />

      {/* Text Overlay - Right Side */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-8 sm:pr-12 md:pr-16 lg:pr-24 z-20">
        <div className="text-right max-w-md sm:max-w-lg md:max-w-xl">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl"
            style={{
              fontFamily: "'Bungee Shade', 'Bungee', 'Creepster', cursive",
              textShadow: '4px 4px 0px rgba(0,0,0,0.8), 6px 6px 0px rgba(255,0,0,0.5)',
              letterSpacing: '2px',
              lineHeight: '1.1',
            }}
          >
            SK8BOY
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-lg leading-relaxed"
            style={{
              fontFamily: "'Bungee', 'Creepster', sans-serif",
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '1px',
            }}
          >
            Ride the streets. Defy gravity. Skate punk culture lives here. Where boards meet concrete and rebellion meets freedom. Keep pushing, keep grinding, keep rolling.
          </p>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-3 sm:p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </section>
  )
}
