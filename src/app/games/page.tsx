import { GameGrid } from '@/components/GameGrid'
import { Navigation } from '@/components/Navigation'

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Game Library
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our extensive collection of educational and entertaining games.
          </p>
        </div>

        <GameGrid />
      </div>
    </div>
  )
}