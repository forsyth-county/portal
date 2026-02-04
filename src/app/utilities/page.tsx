import { Navigation } from '@/components/Navigation'
import Link from 'next/link'

export default function UtilitiesPage() {
  const utilities = [
    {
      name: "About Blank Cloaker",
      description: "Cloak your browser tab to look like about:blank",
      path: "/utilities/about-blank-cloaker",
      icon: "fas fa-eye-slash"
    },
    {
      name: "Silk Browser", 
      description: "Alternative web browser interface",
      path: "/utilities/silk",
      icon: "fas fa-globe"
    },
    {
      name: "Ruffle SWF Player",
      description: "Play Flash games and animations",
      path: "/utilities/ruffle", 
      icon: "fas fa-play-circle"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Utilities
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Helpful tools and utilities for your browsing experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {utilities.map((utility) => (
            <div key={utility.path} className="group bg-gray-800/40 border border-gray-700 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/60 hover:border-gray-600 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${utility.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{utility.name}</h3>
                <p className="text-gray-400 text-sm">{utility.description}</p>
              </div>
              
              <Link 
                href={utility.path}
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg text-center font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                Open Utility
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}