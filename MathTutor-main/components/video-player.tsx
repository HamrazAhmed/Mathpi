"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Video {
  title: string
  url: string
  views: number
  subscribers: number
  published: string
}

interface VideoPlayerProps {
  video: Video
  onClose: () => void
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  // Extract video ID from URL
  const videoId = video.url.split("v=")[1]

  // Disable scrolling when player is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl overflow-hidden w-full max-w-5xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 pr-8">{video.title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              {new Intl.NumberFormat().format(video.views)} views
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              {new Intl.NumberFormat().format(video.subscribers)} subscribers
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              Published {new Date(video.published).toLocaleDateString()}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

