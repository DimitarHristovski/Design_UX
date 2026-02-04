'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className={`text-2xl md:text-3xl font-bold transition-colors ${
              isScrolled
                ? 'text-gray-900 hover:text-gray-700'
                : 'text-white drop-shadow-lg hover:text-white/90'
            }`}
            aria-label="Home"
          >
            DH
          </Link>

          <button
            onClick={toggleMenu}
            className={`focus:outline-none focus:ring-2 rounded-md p-2 transition-colors ${
              isScrolled
                ? 'text-gray-900 focus:ring-gray-900'
                : 'text-white focus:ring-white drop-shadow-md'
            }`}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
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
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ${
              isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg'
                : 'bg-black/80 backdrop-blur-md'
            }`}
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                href="#home"
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors py-2 ${
                  isScrolled
                    ? 'text-gray-900 hover:text-gray-700'
                    : 'text-white hover:text-white/90'
                }`}
              >
                Home
              </Link>
              <Link
                href="#about"
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors py-2 ${
                  isScrolled
                    ? 'text-gray-900 hover:text-gray-700'
                    : 'text-white hover:text-white/90'
                }`}
              >
                About
              </Link>
              <Link
                href="#services"
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors py-2 ${
                  isScrolled
                    ? 'text-gray-900 hover:text-gray-700'
                    : 'text-white hover:text-white/90'
                }`}
              >
                Services
              </Link>
              <Link
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className={`block font-medium transition-colors py-2 ${
                  isScrolled
                    ? 'text-gray-900 hover:text-gray-700'
                    : 'text-white hover:text-white/90'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
