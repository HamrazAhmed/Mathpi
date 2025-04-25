"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trophy,
  Star,
  BookOpen,
  Youtube,
  Loader2,
  InfoIcon,
  Play,
  TrendingUp,
  Clock,
  Users,
  Search,
  ArrowLeft,
} from "lucide-react"
import confetti from "canvas-confetti"
import { Navigation } from "@/components/dashboard/navigation"
import { GradientRing } from "@/components/ui/gradient-ring"
import { formatDistanceToNow } from "date-fns"
import axios from "axios"
import CreditsWrapper from "@/app/creditsWrapper"

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

interface Video {
  title: string
  url: string
  views: number
  subscribers: number
  published: string
}

const getNodePositions = (nodes, schedule: string) => {
  const dayCount = Number.parseInt(schedule.replace("d", ""))
  const filteredNodes = nodes.slice(0, dayCount)

  const maxLevel = Math.ceil(Math.log2(dayCount + 1))
  const baseWidth = Math.min(window.innerWidth - 450, 1200)
  const baseHeight = Math.min(window.innerHeight, 800)
  const verticalSpacing = baseHeight / (maxLevel + 1)

  const getHorizontalSpacing = (level: number) => {
    const nodesInLevel = Math.min(Math.pow(2, level), dayCount - (Math.pow(2, level) - 1))
    return baseWidth / nodesInLevel
  }

  return filteredNodes.map((node, index) => {
    const level = Math.floor(Math.log2(index + 1))
    const nodesInLevel = Math.min(Math.pow(2, level), dayCount - (Math.pow(2, level) - 1))
    const positionInLevel = index - (Math.pow(2, level) - 1)
    const horizontalSpacing = getHorizontalSpacing(level)
    const levelWidth = horizontalSpacing * (nodesInLevel + 1)
    const startX = (baseWidth - levelWidth) / 2 + 50

    return {
      ...node,
      x: startX + horizontalSpacing * (positionInLevel + 1),
      y: (level + 1) * verticalSpacing,
      level,
    }
  })
}

const scheduleOptions = [
  { value: "10d", label: "10 Days" },
  { value: "15d", label: "15 Days" },
  { value: "20d", label: "20 Days" },
]

interface Node {
  id: string
  title: string
  heading: string
  description: string
  resources?: {
    type: string
    title: string
    author: string
    platform: string
  }[]
}

const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 z-[-1]">
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/50 to-muted/90" />
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-overlay"
          style={{
            width: Math.random() * 300 + 50,
            height: Math.random() * 300 + 50,
            background: `radial-gradient(circle, hsl(var(--primary)/${Math.random() * 0.08}) 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 140}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

const InfoSection = () => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-24 left-4 z-20">
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <InfoIcon className="w-5 h-5 text-primary" />
          <span className="font-medium">Node Status Guide</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-primary" />
            <span className="text-sm">Purple: Not completed yet</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-background border-2 border-primary" />
            <span className="text-sm">White: Successfully completed</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const TreeNode = ({
  node,
  index,
  totalNodes,
  progress,
  onNodeClick,
  isActive,
}: {
  node: Node & { x: number; y: number; level: number }
  index: number
  totalNodes: number
  progress: string[]
  onNodeClick: (node: Node) => void
  isActive: boolean
}) => {
  const isCompleted = progress.includes(node.id)
  const isAvailable = index === 0 || progress.length > 0
  const isDark = !isCompleted // Reverse the logic so incomplete nodes are dark

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: index * 0.05,
      }}
      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: node.x, top: node.y }}
      onClick={() => isAvailable && onNodeClick(node)}
    >
      {/* Floating & Pulsing Effect */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1], // Pulsing effect
          y: [0, -5, 0], // Floating effect
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.15 }}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ${isDark ? "text-black" : "bg-background text-foreground border-2 border-primary"
            }`}
          style={{
            boxShadow: isCompleted ? "0 0 20px rgba(var(--primary), 0.3)" : "0 0 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Background Gradient with Mask */}
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 [mask-image:linear-gradient(white,transparent)] opacity-80"></div>
          )}

          {/* Active Animation Effect */}
          {isActive && (
            <motion.div
              className="absolute -inset-2 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              style={{ border: "2px solid hsl(var(--primary))" }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 text-center p-2">
            <div className="font-bold text-sm">{node.title}</div>
            <div className="text-xs opacity-75 line-clamp-2">{node.heading}</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Video Suggestion Component
const VideoSuggestion = ({ topic }: { topic: string }) => {
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [error, setError] = useState("")

  const fetchVideos = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("https://youtube-video-seven.vercel.app/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `${topic} best tutorial detailed explanation` }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch videos")
      }

      const data = await response.json()
      setVideos(data.top_videos || [])
    } catch (error) {
      console.error("Error fetching videos:", error)
      setError("Failed to load video suggestions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenVideoDialog = () => {
    setIsVideoDialogOpen(true)
    fetchVideos()
  }

  const handleCloseVideoDialog = () => {
    setIsVideoDialogOpen(false)
    setSelectedVideo(null)
  }

  const playVideo = (video: Video) => {
    setSelectedVideo(video)
  }

  const backToVideoList = () => {
    setSelectedVideo(null)
  }

  // Extract video ID from URL
  const getVideoId = (url: string) => {
    return url.split("v=")[1]
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg cursor-pointer group border border-purple-100 hover:border-purple-200 transition-all"
        onClick={handleOpenVideoDialog}
      >
        <div className="bg-red-500 rounded-full p-2 group-hover:scale-110 transition-transform">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
            Get Video Suggestions
          </p>
          <p className="text-sm text-gray-500">Find the best videos on {topic}</p>
        </div>
        <motion.div
          className="bg-purple-100 rounded-full p-1.5 text-purple-600"
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Search className="w-4 h-4" />
        </motion.div>
      </motion.div>

      <Dialog open={isVideoDialogOpen} onOpenChange={handleCloseVideoDialog}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white/95 backdrop-blur-md border-purple-200 z-50">
          <AnimatePresence mode="wait">
            {!selectedVideo ? (
              <motion.div key="video-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DialogHeader className="p-6 pb-2 border-b border-purple-100">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-purple-800">
                    <Youtube className="w-6 h-6 text-red-500" />
                    <span>Video Suggestions</span>
                  </DialogTitle>
                  <DialogDescription className="text-purple-600 font-medium">
                    Discover the best videos about <span className="text-purple-800 font-semibold">{topic}</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                        <div className="absolute inset-0 rounded-full bg-purple-100 blur-xl opacity-30 animate-pulse"></div>
                      </div>
                      <p className="text-purple-700 mt-4 font-medium">Searching for the best videos...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      <p>{error}</p>
                      <Button
                        variant="outline"
                        className="mt-4 border-purple-200 text-purple-700 hover:bg-purple-50"
                        onClick={fetchVideos}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : videos.length === 0 ? (
                    <div className="text-center py-8 text-purple-600">
                      <p>No videos found. Try a different search term.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      {videos.map((video, index) => (
                        <VideoCard key={video.url} video={video} index={index} onClick={() => playVideo(video)} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="video-player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
                <div className="p-4 border-b border-purple-100 flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={backToVideoList}
                    className="mr-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h3 className="text-lg font-semibold text-purple-800 line-clamp-1 flex-1">{selectedVideo.title}</h3>
                </div>

                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.url)}?autoplay=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>

                <div className="p-4 md:p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedVideo.title}</h2>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="bg-purple-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-purple-700">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      {formatNumber(selectedVideo.views)} views
                    </div>
                    <div className="bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-blue-700">
                      <Users className="w-4 h-4 text-blue-500" />
                      {formatNumber(selectedVideo.subscribers)} subscribers
                    </div>
                    <div className="bg-amber-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-amber-700">
                      <Clock className="w-4 h-4 text-amber-500" />
                      {formatDistanceToNow(new Date(selectedVideo.published), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  )
}

function VideoCard({ video, index, onClick }: { video: Video; index: number; onClick: () => void }) {
  const videoId = video.url.split("v=")[1]
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-purple-100 hover:border-purple-300"
    >
      <div className="relative w-40 h-24 flex-shrink-0">
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            ; (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          }}
        />
        <div
          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          onClick={onClick}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-red-600 rounded-full p-2">
            <Play className="h-5 w-5 text-white" />
          </motion.div>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className="font-medium text-sm line-clamp-2 cursor-pointer hover:text-purple-700 transition-colors"
            onClick={onClick}
          >
            {video.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-purple-500" />
            <span>{formatNumber(video.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-500" />
            <span>{formatDistanceToNow(new Date(video.published), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function RoadmapPage() {
  const [subject, setSubject] = useState("")
  const [schedule, setSchedule] = useState("")
  const [started, setStarted] = useState(false)
  const [progress, setProgress] = useState<string[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [activeNodeId, setActiveNodeId] = useState<string>("")
  const [mockRoadmapData, setMockRoadmapData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedProgress = localStorage.getItem("treeProgress")
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress))
    }
  }, [])

  const handleStart = async () => {
    if (subject && schedule) {
      setStarted(true)
      setLoading(true)

      // Reset progress for new roadmap
      setProgress([])
      localStorage.removeItem("treeProgress")

      const token = localStorage.getItem("mathTutorToken")

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}/api/users/roadmap`,
          {
            topic: subject,
            days: schedule,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const jsonString = res.data.roadmap.match(/\[\s*\{.*\}\s*\]/s)[0]
        const jsonData = JSON.parse(jsonString)
        setCredits(res.data.credits)
        sessionStorage.setItem('credits', res.data.credits)
        setMockRoadmapData(jsonData)

        setProgress(["0"])
        localStorage.setItem("treeProgress", JSON.stringify(["0"]))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node)
    setActiveNodeId(node.id)
  }

  const completeNode = () => {
    if (selectedNode) {
      const newProgress = [...new Set([...progress, selectedNode.id])]
      setProgress(newProgress)
      localStorage.setItem("treeProgress", JSON.stringify(newProgress))
      setSelectedNode(null)

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
  }

  const positionedNodes = useMemo(() => {
    if (!schedule) return []
    return getNodePositions(mockRoadmapData, schedule)
  }, [mockRoadmapData, schedule])

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


  return (
    <CreditsWrapper>
      <div className="flex flex-col relative overflow-hidden lg:flex-row w-full min-h-screen">
        <Navigation />
        <GradientRing className="left-[-260px] top-[3%] pointer-events-none hidden md:block z-10" />
        <GradientRing className="right-[-300px] top-[10%] pointer-events-none hidden md:block z-10" />

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="relative">
              <Loader2 className="animate-spin h-16 w-16 text-white" />
              <div className="absolute inset-0 rounded-full bg-white blur-xl opacity-30 animate-pulse"></div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-8 w-full">
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


          <main className="flex-1 p-4 w-full flex flex-col items-center justify-center">
            <div className="w-full">
              <BackgroundPattern />

              {!started ? (
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                  <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">Gamified Learning</h1>

                  <div className="flex justify-center items-center">
                    <div>
                      <img
                        src="/images/GamifiedLearning.JPG"
                        alt="Gamified Learning"
                        className="rounded-lg object-cover mr-10"
                        width={230}
                        height={230}
                      />
                    </div>

                    <div className="max-w-md w-full space-y-8">
                      <h2 className="text-xl text-purple-600 mb-4 font-semibold">
                        Begin your learning adventure here, what would you like to learn about?
                      </h2>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6 bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-xl"
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Subject/Title</label>
                          <Input
                            placeholder="What do you want to learn?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="bg-background/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Learning Schedule</label>
                          <Select value={schedule} onValueChange={setSchedule}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select your pace" />
                            </SelectTrigger>
                            <SelectContent>
                              {scheduleOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          className="w-full bg-primary/90 hover:bg-primary"
                          size="lg"
                          onClick={handleStart}
                          disabled={!subject || !schedule}
                        >
                          Begin Adventure
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 w-full h-screen p-8">
                  <div className="flex justify-center items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
                      <div className="flex justify-center items-center">
                        <div>
                          <img
                            src="/images/GamifiedLearning.JPG"
                            alt="Gamified Learning"
                            className="rounded-lg object-cover mr-10"
                            width={100}
                            height={100}
                          />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold text-purple-600">Gamified Learning</h1>
                          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 ml-4">
                            Roadmap of {subject}
                          </h2>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <InfoSection />

                  <div className="w-full h-full">
                    {positionedNodes.map((node, index) => (
                      <TreeNode
                        key={node.id}
                        node={node}
                        index={index}
                        totalNodes={positionedNodes.length}
                        progress={progress}
                        onNodeClick={handleNodeClick}
                        isActive={activeNodeId === node.id}
                      />
                    ))}
                  </div>

                  <Dialog open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
                    <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-purple-200 z-50">
                      {" "}
                      {/* Set z-index to 50 */}
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl text-purple-800">
                          <Star className="w-6 h-6 text-amber-500" />
                          {selectedNode?.heading}
                        </DialogTitle>
                        <DialogDescription className="text-base text-purple-600">
                          {selectedNode?.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        {/* Video Suggestion Component */}
                        <VideoSuggestion topic={selectedNode?.heading || ""} />

                        {/* Other resources if needed */}
                        {selectedNode?.resources
                          ?.filter((r) => r.type !== "video")
                          .map((resource, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <div className="text-sm">
                                  <p className="font-medium text-blue-800">{resource.title}</p>
                                  <p className="text-blue-600">{resource.author}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="flex flex-row justify-center items-center gap-3 mt-2">
                        <Button
                          className="w-full text-lg py-6 font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 text-white"
                          onClick={() =>
                            window.open(
                              `/dashboard/quiz?title='${selectedNode?.heading} ${selectedNode?.description}'`,
                              "_blank",
                            )
                          }
                        >
                          🚀 Test Your Knowledge
                        </Button>
                        <Button
                          className="w-full text-lg py-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={completeNode}
                          disabled={progress.includes(selectedNode?.id || "")}
                        >
                          {progress.includes(selectedNode?.id || "") ? (
                            <span className="flex items-center gap-2">
                              <Trophy className="w-5 h-5" />
                              Completed
                            </span>
                          ) : (
                            "Mark as Complete"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </main>
        </main>
      </div>
    </CreditsWrapper>

  )
}

