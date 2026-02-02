'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
            aria-label="Home"
          >
            DH
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#home"
              className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="#services"
              className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              href="#contact"
              className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          <button
            className="md:hidden text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 rounded-md p-2"
            aria-label="Toggle menu"
            aria-expanded="false"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}
