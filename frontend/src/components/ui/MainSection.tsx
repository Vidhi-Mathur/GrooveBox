"use client"
import { useState, useEffect } from "react"

const featuredAlbums = [{
    id: 1,
    title: "Midnight Vibes",
    artist: "Luna Eclipse",
    image: "/album-cover-midnight-vibes-dark-aesthetic.jpg",
  }, {
    id: 2,
    title: "Summer Beats",
    artist: "Solar Flare",
    image: "/album-cover-summer-beats-bright-colorful.jpg",
  }, {
    id: 3,
    title: "Urban Rhythms",
    artist: "City Pulse",
    image: "/album-cover-urban-rhythms-city-skyline.jpg",
  }
]

export function HeroSection() {
  const [currentAlbum, setCurrentAlbum] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlbum((prev) => (prev + 1) % featuredAlbums.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600/10 to-teal-500/10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-700 dark:text-slate-100 leading-tight text-balance">
                Discover Your
                <span className="text-emerald-600 dark:text-emerald-500 block">
                  Perfect Sound
                </span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 text-pretty">
                Explore millions of songs, create personalized playlists, and
                connect with your favorite artists in one seamless experience.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-500 transition-all transform hover:scale-105">
                Start Listening
              </button>
              <button className="border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Browse Music
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                  50M+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Songs
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                  2M+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Artists
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                  100K+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Playlists
                </div>
              </div>
            </div>
          </div>

          {/* Album Carousel */}
          <div className="relative">
            <div className="relative w-80 h-80 mx-auto">
              {featuredAlbums.map((album, index) => (
                <div
                  key={album.id}
                  className={`absolute inset-0 transition-all duration-500 ${
                    index === currentAlbum
                      ? "opacity-100 scale-100 z-10"
                      : index === (currentAlbum + 1) % featuredAlbums.length
                      ? "opacity-60 scale-95 translate-x-4 z-5"
                      : "opacity-30 scale-90 translate-x-8 z-0"
                  }`}
                >
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl">
                    <img
                      src={album.image || "/placeholder.svg"}
                      alt={album.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">
                      {album.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {album.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {featuredAlbums.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAlbum(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentAlbum
                      ? "bg-emerald-600 dark:bg-emerald-500"
                      : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
