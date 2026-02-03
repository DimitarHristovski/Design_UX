import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'

// Generate slides array with all 40 frames
const frameSlides = Array.from({ length: 40 }, (_, i) => {
  const frameNumber = String(i + 1).padStart(3, '0')
  return {
    id: i + 1,
    image: `/images/ezgif-frames/ezgif-frame-${frameNumber}.jpg`,
    headline: '',
    subtitle: '',
    ctaText: '',
  }
})

// The two additional images (separate from the 40 frames)
const additionalImages = [
  {
    id: 41,
    image: '/images/Whisk_czn0kjyxadz5uwzh1czhdtotemy1qtlhndm40im.jpeg',
    headline: '',
    subtitle: '',
    ctaText: '',
  },
  {
    id: 42,
    image: '/images/Whisk_y2nxkdmzudm0cdom1ym5ctotqtyzqtl3gdmi1co.jpeg',
    headline: '',
    subtitle: '',
    ctaText: '',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSlider slides={frameSlides} additionalImages={additionalImages} />
    </main>
  )
}
