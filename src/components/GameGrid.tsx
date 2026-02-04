'use client'

import { useState, useMemo } from 'react'
import { GameCard } from './GameCard'

// Game data extracted from your existing games directory
const games = [
  { name: "1v1.lol", path: "1v1lol", category: "Action", featured: true },
  { name: "2048", path: "2048", category: "Puzzle", featured: true },
  { name: "10 Bullets", path: "10-bullets", category: "Action", featured: false },
  { name: "10 Minutes Till Dawn", path: "10-minutes-till-dawn", category: "Action", featured: true },
  { name: "1on1 Soccer", path: "1on1-soccer", category: "Sports", featured: false },
  { name: "A Dance of Fire and Ice", path: "a-dance-of-fire-and-ice", category: "Rhythm", featured: true },
  { name: "Age of War", path: "age-of-war", category: "Strategy", featured: false },
  { name: "Among Us", path: "among-us", category: "Social", featured: true },
  { name: "Angry Birds", path: "angry-birds", category: "Puzzle", featured: true },
  { name: "Appel", path: "appel", category: "Platformer", featured: false },
  { name: "Awesome Tanks 2", path: "awesome-tanks-2", category: "Action", featured: false },
  { name: "Bad Ice Cream 3", path: "bad-ice-cream-3", category: "Arcade", featured: false },
  { name: "Bad Time Simulator", path: "bad-time-simulator", category: "Action", featured: false },
  { name: "Baldi's Basics", path: "baldis-basics", category: "Horror", featured: false },
  { name: "Basketball Stars", path: "basketball-stars", category: "Sports", featured: false },
  { name: "Big Ice Tower Tiny Square", path: "big-ice-tower-tiny-square", category: "Platformer", featured: false },
  { name: "Big Neon Tower Tiny Square", path: "big-neon-tower-tiny-square", category: "Platformer", featured: false },
  { name: "Big Tower Tiny Square", path: "big-tower-tiny-square", category: "Platformer", featured: false },
  { name: "Big Tower Tiny Square 2", path: "big-tower-tiny-square-2", category: "Platformer", featured: false },
  { name: "Bit Planes", path: "bit-planes", category: "Action", featured: false },
  { name: "BitLife", path: "bitlife", category: "Simulation", featured: false },
  { name: "Block Blast", path: "block-blast", category: "Puzzle", featured: false },
  { name: "Bloons Tower Defense 5", path: "bloons-tower-defense-5", category: "Strategy", featured: true },
  { name: "Bob the Robber 5", path: "bob-the-robber-5", category: "Adventure", featured: false },
  { name: "Brawl Stars", path: "brawl-stars", category: "Action", featured: false },
  { name: "Candy Crush", path: "candy-crush", category: "Puzzle", featured: false },
  { name: "Celeste", path: "celeste", category: "Platformer", featured: true },
  { name: "Cookie Clicker", path: "cookie-click", category: "Idle", featured: false },
  { name: "Cut the Rope Time Travel", path: "cut-the-rope-time-travel", category: "Puzzle", featured: false },
  { name: "Dadish 3", path: "dadish-3", category: "Platformer", featured: false },
  { name: "Death Run 3D", path: "death-run-3d", category: "Running", featured: false },
  { name: "Doodle Jump", path: "doodle-jump", category: "Arcade", featured: false },
  { name: "Doomzio", path: "doomzio", category: "Action", featured: false },
  { name: "Drift Boss", path: "drift-boss", category: "Racing", featured: false },
  { name: "Drive Mad", path: "drive-mad", category: "Racing", featured: false },
  { name: "Duck Life 5", path: "duck-life-5", category: "Adventure", featured: false },
  { name: "Eaglercraft", path: "eaglercraft", category: "Sandbox", featured: true },
  { name: "Escape Road", path: "escape-road", category: "Racing", featured: false },
  { name: "Fancy Pants Adventures", path: "fancy-pants-adventures", category: "Platformer", featured: false },
  { name: "Fireboy and Watergirl 3", path: "fireboy-and-watergirl-3", category: "Puzzle", featured: false },
  { name: "Five Nights at Freddy's 4", path: "five-nights-at-freddys-4", category: "Horror", featured: false },
  { name: "Fly the Farthest", path: "fly-the-farthest", category: "Arcade", featured: false },
  { name: "Fruit Ninja", path: "fruit-ninja", category: "Arcade", featured: false },
  { name: "Gun Mayhem", path: "gun-mayhem", category: "Action", featured: false },
  { name: "Heist", path: "heist", category: "Strategy", featured: false },
  { name: "Henry Stickmin Escaping the Prison", path: "henry-stickmin-escaping-the-prison", category: "Adventure", featured: false },
  { name: "Hole.io", path: "holeio", category: "IO", featured: false },
  { name: "Hollow Knight", path: "hollow-knight", category: "Platformer", featured: true },
  { name: "Justfall.lol", path: "justfalllol", category: "Platformer", featured: false },
  { name: "Kingdom Rush", path: "kingdom-rush", category: "Strategy", featured: false },
  { name: "Kingdom Rush Frontiers", path: "kingdom-rush-frontiers", category: "Strategy", featured: false },
  { name: "Knights Battle Arena", path: "knights-battle-arena", category: "Action", featured: false },
  { name: "Layers Roll", path: "layers-roll", category: "Arcade", featured: false },
  { name: "Learn to Fly 3", path: "learn-to-fly-3", category: "Arcade", featured: false },
  { name: "Melon Playground", path: "melon-playground", category: "Sandbox", featured: false },
  { name: "Monkey Mart", path: "monkey-mart", category: "Management", featured: false },
  { name: "Moto X3M 1", path: "motox3m-1", category: "Racing", featured: false },
  { name: "Moto X3M 2", path: "motox3m-2", category: "Racing", featured: false },
  { name: "Moto X3M 3", path: "motox3m-3", category: "Racing", featured: false },
  { name: "Moto X3M Pool Party", path: "motox3m-poolparty", category: "Racing", featured: false },
  { name: "Moto X3M Spooky Land", path: "motox3m-spookyland", category: "Racing", featured: false },
  { name: "Moto X3M Winter Land", path: "motox3m-winterland", category: "Racing", featured: false },
  { name: "Ngon", path: "ngon", category: "Arcade", featured: false },
  { name: "Only Up", path: "only-up", category: "Platformer", featured: false },
  { name: "OvO Dimensions", path: "ovo-dimensions", category: "Platformer", featured: false },
  { name: "Paper.io 2", path: "paperio-2", category: "IO", featured: false },
  { name: "Parking Fury 3", path: "parking-fury-3", category: "Driving", featured: false },
  { name: "Pixel Shooter", path: "pixel-shooter", category: "Action", featured: false },
  { name: "Plants vs Zombies", path: "plants-vs-zombies", category: "Strategy", featured: false },
  { name: "Polytrack", path: "polytrack", category: "Racing", featured: false },
  { name: "Rainbow Obby", path: "rainbow-obby", category: "Platformer", featured: false },
  { name: "Retro Bowl", path: "retrobowl", category: "Sports", featured: true },
  { name: "RocketGoal.io", path: "rocketgoalio", category: "Sports", featured: false },
  { name: "Rooftop Snipers", path: "rooftop-snipers", category: "Action", featured: false },
  { name: "Run 3", path: "run3", category: "Running", featured: true },
  { name: "Save My Pet", path: "save-my-pet", category: "Puzzle", featured: false },
  { name: "Slope", path: "slope", category: "Running", featured: true },
  { name: "Snake.io", path: "snakeio", category: "IO", featured: false },
  { name: "Snow Rider 3D", path: "snow-rider-3d", category: "Racing", featured: false },
  { name: "Snowball.io", path: "snowballio", category: "IO", featured: false },
  { name: "Soccer Random", path: "soccer-random", category: "Sports", featured: false },
  { name: "Speed Per Click", path: "speed-per-click", category: "Clicker", featured: false },
  { name: "Spiral Roll", path: "spiral-roll", category: "Arcade", featured: false },
  { name: "Steal a Brainrot", path: "steal-a-brainrot", category: "Adventure", featured: false },
  { name: "Stick War 2", path: "stick-war-2", category: "Strategy", featured: false },
  { name: "Stick Warriors", path: "stick-warriors", category: "Action", featured: false },
  { name: "Stickman Climb", path: "stickman-climb", category: "Platformer", featured: false },
  { name: "Stickman Hook", path: "stickman-hook", category: "Platformer", featured: false },
  { name: "Sticky Ninja Academy", path: "sticky-ninja-academy", category: "Platformer", featured: false },
  { name: "Stumble Guys", path: "stumble-guys", category: "Party", featured: false },
  { name: "Subway Surfers San Francisco", path: "subway-surfers-san-francisco", category: "Running", featured: false },
  { name: "Super Mario Bros", path: "super-mario-bros", category: "Platformer", featured: true },
  { name: "Super Smash Bros", path: "super-smash-bros", category: "Fighting", featured: false },
  { name: "Swords and Souls", path: "swords-and-souls", category: "RPG", featured: false },
  { name: "Temple Run 2", path: "temple-run-2", category: "Running", featured: false },
  { name: "Territorial.io", path: "territorialio", category: "Strategy", featured: false },
  { name: "Tetris", path: "tetris", category: "Puzzle", featured: true },
  { name: "The Impossible Quiz", path: "the-impossible-quiz", category: "Puzzle", featured: false },
  { name: "The Legend of Zelda: Majora's Mask", path: "the-legend-of-zelda-majoras-mask", category: "Adventure", featured: false },
  { name: "The Legend of Zelda: Ocarina of Time", path: "the-legend-of-zelda-ocarina-of-time", category: "Adventure", featured: false },
  { name: "The Oregon Trail", path: "the-oregon-trail", category: "Strategy", featured: false },
  { name: "This is the Only Level", path: "this-is-the-only-level", category: "Platformer", featured: false },
  { name: "Time Shooter 2", path: "time-shooter-2", category: "Action", featured: false },
  { name: "Time Shooter 3 SWAT", path: "time-shooter-3-swat", category: "Action", featured: false },
  { name: "Tiny Fishing", path: "tiny-fishing", category: "Arcade", featured: false },
  { name: "World's Hardest Game 3", path: "worlds-hardest-game-3", category: "Puzzle", featured: false }
]

interface GameGridProps {
  featured?: boolean
  limit?: number
}

export function GameGrid({ featured = false, limit }: GameGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(games.map(game => game.category)))]

  const filteredGames = useMemo(() => {
    let filtered = games
    
    if (featured) {
      filtered = filtered.filter(game => game.featured)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(game => game.category === selectedCategory)
    }
    
    if (limit) {
      filtered = filtered.slice(0, limit)
    }
    
    return filtered
  }, [searchTerm, selectedCategory, featured, limit])

  return (
    <div className="space-y-8">
      {!featured && (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 pr-10 transition-colors"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
            <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredGames.map((game) => (
          <GameCard key={game.path} game={game} />
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-search text-4xl text-gray-600 mb-4"></i>
          <p className="text-xl text-gray-400 mb-2">No games found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}