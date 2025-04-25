"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VideoPlayer } from "@/components/video-player"
import { VideoCard } from "@/components/video-card"
import { GradientRing } from "@/components/ui/gradient-ring"
import { Navigation } from "@/components/dashboard/navigation"
import CreditsWrapper from "@/app/creditsWrapper"

interface Video {
  title: string
  url: string
  views: number
  subscribers: number
  published: string
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [credits, setCredits] = useState<string | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedCredits = sessionStorage.getItem("credits");
      setCredits(storedCredits);
      if (storedCredits) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);



  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      return
    }

    setIsSearching(true)
    setVideos([])
    setSelectedVideo(null)

    try {
      const response = await fetch("https://youtube-video-seven.vercel.app/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch videos")
      }

      const data = await response.json()
      setVideos(data.top_videos)

    } catch (error) {
      console.error("Error searching videos:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video)
  }

  const closePlayer = () => {
    setSelectedVideo(null)
  }

  return (
    <CreditsWrapper>

      <div className="flex flex-col relative overflow-hidden lg:flex-row w-full min-h-screen">
        <GradientRing className="left-[-260px] top-[7%] pointer-events-none hidden md:block z-10" />
        <GradientRing className="right-[-300px] top-[10%] pointer-events-none hidden md:block z-10" />

        <Navigation />
        <main className="flex-1 p-4 flex flex-col items-center justify-center">
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-96 -left-24 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-24 right-1/3 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <main className="flex-1 p-4 lg:p-8">
            <motion.div
              className="absolute top-4 right-4 z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            >
              <motion.div
                className="flex items-center justify-center w-auto px-4 h-12 rounded-full bg-white/90 text-purple-600 shadow-lg hover:shadow-md hover:cursor-pointer"
                style={{ border: "2px solid #7c3aed" }}
                whileHover={{
                  scale: 1.05,
                  borderColor: "#9f7aea",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent"
                  animate={{
                    opacity: [1, 0.9, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  Credits Remaining: {credits}
                </motion.span>
              </motion.div>
            </motion.div>


            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mt-10">
                  Personalized Learning
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                  Search for videos and watch them directly without leaving the page
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSearch}
                className="max-w-3xl mx-auto mb-16 relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Search for videos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 pr-24 py-6 text-lg bg-white border-gray-200 shadow-lg rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder:text-gray-400 h-16"
                  />
                  <Search className="absolute left-4 h-6 w-6 text-gray-400" />
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-6 h-12 text-white"
                  >
                    {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
                  </Button>
                </div>
              </motion.form>

              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                    <p className="text-gray-600 text-lg">Searching for videos...</p>
                  </motion.div>
                ) : videos.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold mb-8 text-center">
                      Top Results for <span className="text-purple-600">{query}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {videos.map((video, index) => (
                        <VideoCard key={video.url} video={video} index={index} onSelect={handleVideoSelect} />
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </main>

          <AnimatePresence>{selectedVideo && <VideoPlayer video={selectedVideo} onClose={closePlayer} />}</AnimatePresence>
        </main>
      </div>
    </CreditsWrapper>
  )
}