"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, BookOpen, Rocket, Award, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import confetti from "canvas-confetti"

export default function SuccessPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Get plan from URL params - in a real app, you'd verify this server-side
  const planId = "basic"

  // Map plan IDs to their details
  const planDetails = {
    basic: {
      name: "MathPi Basic",
      credits: 50,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: Sparkles,
    },
    gold: {
      name: "MathPi Gold",
      credits: 120,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: Award,
    },
    platinum: {
      name: "MathPi Platinum",
      credits: 300,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: Rocket,
    },
  }

  const plan = planDetails[planId as keyof typeof planDetails] || planDetails.basic

  // Trigger confetti effect when component mounts
  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }
  }, [mounted])

  const handleGoToDashboard = () => {
    // In a real app, this would navigate to the user's dashboard
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className={`h-24 w-24 rounded-full ${plan.bgColor} flex items-center justify-center`}>
            <CheckCircle className={`h-14 w-14 ${plan.color}`} />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
          Thank You!
        </h1>

        <p className="text-xl text-slate-600 mb-8">
          Your Donation has been Done successfully
          successfully.
        </p>

        <Card className={`border-2 ${plan.borderColor} ${plan.bgColor} mb-12`}>
          <CardContent className="pt-6 pb-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Access to Assistant Guidance</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Gamified Learning Experience</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Practice Problems Library</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Personalized Learning Path</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Start Learning</h3>
            <p className="text-slate-600">Jump right into your personalized learning path</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Track Progress</h3>
            <p className="text-slate-600">Monitor your improvement with detailed analytics</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Earn Achievements</h3>
            <p className="text-slate-600">Complete challenges and collect badges</p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleGoToDashboard}
          className={`${
            planId === "basic"
              ? "bg-blue-600 hover:bg-blue-700"
              : planId === "gold"
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-purple-600 hover:bg-purple-700"
          } px-8`}
        >
          Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

      </div>
    </div>
  )
}