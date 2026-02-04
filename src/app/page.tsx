import Link from 'next/link'
import { GameGrid } from '@/components/GameGrid'
import { Navigation } from '@/components/Navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent"></div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="mb-8">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/2/2e/ForsythCountySDGAlogo.png" 
              alt="Forsyth County Schools" 
              className="w-32 h-32 mx-auto mb-8 rounded-full shadow-2xl"
            />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Welcome to Forsyth Games
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Explore our collection of educational games designed for learning and fun.
            Built for Forsyth County Schools.
          </p>
          <div className="flex gap-6 justify-center">
            <Link 
              href="/games" 
              className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
            >
              <i className="fas fa-gamepad"></i>
              Explore Games
            </Link>
            <Link 
              href="/utilities" 
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-3"
            >
              <i className="fas fa-tools"></i>
              Utilities
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games Preview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Featured Games
          </h2>
          <GameGrid featured={true} limit={6} />
          <div className="text-center mt-12">
            <Link 
              href="/games" 
              className="text-blue-400 hover:text-blue-300 font-semibold text-lg transition-colors"
            >
              View All Games →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}