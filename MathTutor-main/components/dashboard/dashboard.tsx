"use client"

import { motion } from "framer-motion"
import { Navigation } from "./navigation"
import { Stats } from "./stats"
import { ArrowRight, Brain, GamepadIcon, ListChecks, Loader2, Settings2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { errorToast, successToast } from "@/helpers/toasts"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
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
    <div className="flex flex-col lg:flex-row w-full">
      <Navigation />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-md">
          <Loader2 className="animate-spin h-12 w-12 text-white" />
        </div>
      )}
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
        <div className="space-y-4 lg:space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-center text-purple-600 mb-10">Dashboard</h1>
          </div>

          <Stats />

          <div className="">
            <div className="bg-transparent">
              <div className="space-y-4 lg:space-y-8 p-4">
                <div className="grid gap-4 lg:gap-8 md:grid-cols-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link href="/dashboard/agent">
                    <div className="group cursor-pointer border-none hover:opacity-90 p-3">
                        <div className="flex items-center justify-between mb-4">
                          <Brain className="w-8 h-8 text-primary" />
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-lg font-semibold mb-2">AI Learning</h2>
                        {/* <p className="text-muted-foreground mb-4">
                          Experience personalized learning with our advanced AI system. Track your progress and get instant feedback.
                        </p> */}
                        <div className="aspect-video rounded-lg flex items-center justify-center">
                          <img
                            src="/images/ailearning.png"
                            alt="AI Learning"
                            className="rounded-lg object-cover"
                            width={300}
                            height={300}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/dashboard/roadmap">
                      <div className="group cursor-pointer border-none hover:opacity-90 p-3">
                        <div className="flex items-center justify-between mb-4">
                          <GamepadIcon className="w-8 h-8 text-primary" />
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-lg font-semibold mb-2">Gamified Learning</h2>
                        {/* <p className="text-muted-foreground mb-4">
                          Learn while having fun! Complete challenges, earn rewards, and track your achievements.
                        </p> */}
                        <div className="aspect-video rounded-lg flex items-center justify-center">
                          <img
                            src="/images/GamifiedLearning.png"
                            alt="Gamified Learning"
                            className="rounded-lg object-cover"
                            width={250}
                            height={250}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/dashboard/quiz">
                      <div className="group cursor-pointer border-none hover:opacity-90 p-3">
                        <div className="flex items-center justify-between mb-4">
                          <ListChecks className="w-8 h-8 text-primary" />
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-lg font-semibold mb-2">Practice Problem</h2>
                        {/* <p className"text-muted-foreground mb-4">
                          Sharpen your skills by solving real-world problems. Practice, improve, and test your knowledge.
                        </p> */}
                        <div className="aspect-video rounded-lg flex items-center justify-center">
                          <img
                            src="/images/PracticeProblems.png"
                            alt="Gamified Learning"
                            className="rounded-lg object-cover"
                            width={250}
                            height={250}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/dashboard/learning">
                      <div className="cursor-pointer border-none hover:opacity-90 p-3">
                        <div className="flex items-center justify-between mb-4">
                          <Settings2 className="w-8 h-8 text-primary" />
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-lg font-semibold mb-2">Personalized Learning</h2>
                        {/* <p className="text-muted-foreground mb-4">
                          Learn at your own pace with tailored content that adapts to your strengths and areas for improvement.
                        </p> */}
                        <div className="aspect-video rounded-lg flex items-center justify-center">
                          <img
                            src="/images/PersonalizedLearning.png"
                            alt="Gamified Learning"
                            className="rounded-lg object-cover"
                            width={250}
                            height={250}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full"
            >
              <RecentActivity />
            </motion.div> */}
          </div>
        </div>
      </main>
    </div>
  )
}