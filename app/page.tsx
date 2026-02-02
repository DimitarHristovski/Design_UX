import Header from '@/components/Header'
import HeroSlider from '@/components/HeroSlider'

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80',
    headline: 'Welcome to Excellence',
    subtitle: 'Discover innovative solutions that transform your business',
    ctaText: 'Get Started',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80',
    headline: 'Innovation Meets Quality',
    subtitle: 'Building the future with cutting-edge technology and expertise',
    ctaText: 'Learn More',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80',
    headline: 'Your Success is Our Mission',
    subtitle: 'Partner with us to achieve extraordinary results',
    ctaText: 'Contact Us',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSlider slides={slides} autoPlayInterval={5000} />
    </main>
  )
}
