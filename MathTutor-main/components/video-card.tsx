"use client"

import { motion } from "framer-motion"
import { Play, TrendingUp, Clock, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { formatNumber } from "@/lib/utils"

interface Video {
  title: string
  url: string
  views: number
  subscribers: number
  published: string
}

interface VideoCardProps {
  video: Video
  index: number
  onSelect: (video: Video) => void
}

export function VideoCard({ video, index, onSelect }: VideoCardProps) {
  // Extract video ID from URL
  const videoId = video.url.split("v=")[1]
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  // Format the published date
  const publishedDate = new Date(video.published)
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 },
      }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-purple-200 transition-colors shadow-sm"
    >
      <div className="relative aspect-video group cursor-pointer" onClick={() => onSelect(video)}>
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={video.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            // Fallback to medium quality if maxresdefault is not available
            ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          }}
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-purple-600 rounded-full p-4">
            <Play className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800">{video.title}</h3>

        <div className="flex flex-col space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
            <span>{formatNumber(video.views)} views</span>
          </div>

          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span>{formatNumber(video.subscribers)} subscribers</span>
          </div>

          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-amber-500" />
            <span>Published {timeAgo}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}